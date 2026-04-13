from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
from models.models import Pokemon, CaughtPokemon, EncounterLog, User, Favorite
from auth.token import SECRET_KEY, ALGORITHM
from jose import jwt, JWTError
from datetime import date
import httpx
import random

router = APIRouter()

REGION_IDS = {
    "kanto": 1,
    "johto": 2,
    "hoenn": 3,
}

MAX_ENCOUNTERS_PER_DAY = 5

def get_current_user(request: Request, db: Session):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user_id = payload.get("id")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Cache routes so we don't hammer PokéAPI every time
routes_cache = {}

@router.get("/explore/routes/{region_name}")
async def get_routes(region_name: str):
    region_id = REGION_IDS.get(region_name.lower())
    if not region_id:
        raise HTTPException(status_code=404, detail="Region not found")

    # Return cached routes if available
    if region_name in routes_cache:
        return {"routes": routes_cache[region_name]}

    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.get(f"https://pokeapi.co/api/v2/region/{region_id}")
        if res.status_code != 200:
            raise HTTPException(status_code=404, detail="Region not found in PokéAPI")
        locations = res.json().get("locations", [])

        area_names = []
        for loc in locations:
            loc_res = await client.get(loc["url"])
            if loc_res.status_code != 200:
                continue
            areas = loc_res.json().get("areas", [])
            for area in areas:
                area_names.append(area["name"])

    routes_cache[region_name] = area_names
    return {"routes": area_names}
@router.get("/explore/encounter/{route_name}")
async def get_encounter(route_name: str, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)

    today = str(date.today())
    log = db.query(EncounterLog).filter(
        EncounterLog.user_id == user.id,
        EncounterLog.date == today
    ).first()

    if log and log.count >= MAX_ENCOUNTERS_PER_DAY:
        raise HTTPException(status_code=429, detail="Daily encounter limit reached. Come back tomorrow!")

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            res = await client.get(f"https://pokeapi.co/api/v2/location-area/{route_name}")
            if res.status_code != 200:
                raise HTTPException(status_code=404, detail="Route not found")
            data = res.json()
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(status_code=500, detail="Failed to fetch route data")

    encounters = data.get("pokemon_encounters", [])

    valid = []
    for e in encounters:
        url = e["pokemon"]["url"]
        pokemon_id = int(url.rstrip("/").split("/")[-1])
        if 1 <= pokemon_id <= 386:
            valid.append(pokemon_id)

    if not valid:
        raise HTTPException(status_code=404, detail="No gen 1-3 pokemon on this route. Try another route!")

    random.shuffle(valid)
    pokemon = None
    for pid in valid:
        pokemon = db.query(Pokemon).filter(Pokemon.id == pid).first()
        if pokemon:
            break

    if not pokemon:
        raise HTTPException(status_code=404, detail="No pokemon found in database for this route. Try another!")

    if log:
        log.count += 1
    else:
        log = EncounterLog(user_id=user.id, date=today, count=1)
        db.add(log)
    db.commit()

    return {
        "id": pokemon.id,
        "name": pokemon.name,
        "types": pokemon.types,
        "sprite": pokemon.sprite,
        "capture_rate": pokemon.capture_rate,
        "encounters_used": log.count,
        "encounters_remaining": MAX_ENCOUNTERS_PER_DAY - log.count
    }

@router.post("/explore/catch")
def catch_pokemon(body: dict, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)
    pokemon_id = body.get("pokemon_id")
    ball_type = body.get("ball_type", "pokeball")

    if not pokemon_id:
        raise HTTPException(status_code=400, detail="pokemon_id required")

    pokemon = db.query(Pokemon).filter(Pokemon.id == pokemon_id).first()
    if not pokemon:
        raise HTTPException(status_code=404, detail="Pokemon not found")

    # Check inventory
    from models.models import PlayerProgress
    progress = db.query(PlayerProgress).filter(PlayerProgress.user_id == user.id).first()
    if not progress:
        from routers.shop import get_or_create_progress
        progress = get_or_create_progress(user.id, db)

    # Check ball availability and multiplier
    BALL_DATA = {
        "pokeball": {"field": "pokeballs", "multiplier": 1.0},
        "great_ball": {"field": "great_balls", "multiplier": 1.5},
        "ultra_ball": {"field": "ultra_balls", "multiplier": 2.0},
    }

    ball = BALL_DATA.get(ball_type, BALL_DATA["pokeball"])
    ball_count = getattr(progress, ball["field"])

    if ball_count <= 0:
        raise HTTPException(status_code=400, detail=f"No {ball_type}s left!")

    # Check if already caught
    already_caught = db.query(CaughtPokemon).filter(
        CaughtPokemon.user_id == user.id,
        CaughtPokemon.pokemon_id == pokemon_id
    ).first()
    if already_caught:
        return {"result": "already_caught", "message": "You already have this pokemon!"}

    # Deduct ball from inventory
    setattr(progress, ball["field"], ball_count - 1)

    # Calculate catch success
    capture_rate = pokemon.capture_rate or 45
    catch_probability = min(1.0, (capture_rate / 255) * ball["multiplier"])
    success = random.random() < catch_probability

    if success:
        caught = CaughtPokemon(user_id=user.id, pokemon_id=pokemon_id)
        db.add(caught)
        db.commit()
        return {"result": "caught", "message": f"You caught {pokemon.name.capitalize()}!"}
    else:
        db.commit()
        return {"result": "fled", "message": f"{pokemon.name.capitalize()} fled!"}
    
@router.get("/explore/collection")
def get_collection(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)
    
    caught = db.query(CaughtPokemon).filter(
        CaughtPokemon.user_id == user.id
    ).all()

    result = []
    for c in caught:
        pokemon = db.query(Pokemon).filter(Pokemon.id == c.pokemon_id).first()
        if pokemon:
            result.append({
                "id": c.id,
                "pokemon_id": pokemon.id,
                "name": pokemon.name,
                "types": pokemon.types,
                "sprite": pokemon.sprite,
                "caught_at": str(c.caught_at),
            })

    return {"collection": result}


@router.get("/explore/favorites")
def get_favorites(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)

    favs = db.query(Favorite).filter(Favorite.user_id == user.id).all()

    result = []
    for f in favs:
        pokemon = db.query(Pokemon).filter(Pokemon.id == f.pokemon_id).first()
        if pokemon:
            result.append({
                "id": f.id,
                "pokemon_id": pokemon.id,
                "name": pokemon.name,
                "types": pokemon.types,
                "sprite": pokemon.sprite,
            })

    return {"favorites": result}

@router.post("/explore/favorite/{pokemon_id}")
def add_favorite(pokemon_id: int, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)

    # Check if pokemon is caught
    caught = db.query(CaughtPokemon).filter(
        CaughtPokemon.user_id == user.id,
        CaughtPokemon.pokemon_id == pokemon_id
    ).first()
    if not caught:
        raise HTTPException(status_code=400, detail="You can only favorite pokemon you have caught!")

    # Check if already favorited
    existing = db.query(Favorite).filter(
        Favorite.user_id == user.id,
        Favorite.pokemon_id == pokemon_id
    ).first()
    if existing:
        return {"message": "Already favorited"}

    fav = Favorite(user_id=user.id, pokemon_id=pokemon_id)
    db.add(fav)
    db.commit()
    return {"message": "Added to favorites"}

@router.delete("/explore/favorite/{pokemon_id}")
def remove_favorite(pokemon_id: int, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)

    fav = db.query(Favorite).filter(
        Favorite.user_id == user.id,
        Favorite.pokemon_id == pokemon_id
    ).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")

    db.delete(fav)
    db.commit()
    return {"message": "Removed from favorites"}

@router.get("/explore/encounter-status")
def get_encounter_status(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)
    today = str(date.today())
    
    log = db.query(EncounterLog).filter(
        EncounterLog.user_id == user.id,
        EncounterLog.date == today
    ).first()

    count = log.count if log else 0
    return {
        "encounters_used": count,
        "encounters_remaining": MAX_ENCOUNTERS_PER_DAY - count
    }