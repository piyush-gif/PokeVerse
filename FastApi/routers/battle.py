from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
from models.models import Pokemon, CaughtPokemon, PlayerProgress, Badge, User, BattleSession
from auth.token import SECRET_KEY, ALGORITHM
from jose import jwt, JWTError
from datetime import datetime
import httpx
import random

router = APIRouter()

GYMS = {
    1: {
        "id": 1,
        "region": "kanto",
        "name": "Brock",
        "gym": "Pewter City Gym",
        "badge": "Boulder Badge",
        "specialty": "rock",
        "reward_coins": 500,
        "reward_pokeballs": 5,
        "reward_great_balls": 0,
        "team": [
            {"pokemon_id": 74, "name": "geodude", "level": 50},
            {"pokemon_id": 95, "name": "onix", "level": 50},
        ]
    },
    2: {
        "id": 2,
        "region": "kanto",
        "name": "Misty",
        "gym": "Cerulean City Gym",
        "badge": "Cascade Badge",
        "specialty": "water",
        "reward_coins": 700,
        "reward_pokeballs": 5,
        "reward_great_balls": 3,
        "team": [
            {"pokemon_id": 120, "name": "staryu", "level": 50},
            {"pokemon_id": 121, "name": "starmie", "level": 50},
        ]
    },
    3: {
        "id": 3,
        "region": "kanto",
        "name": "Lt. Surge",
        "gym": "Vermilion City Gym",
        "badge": "Thunder Badge",
        "specialty": "electric",
        "reward_coins": 900,
        "reward_pokeballs": 5,
        "reward_great_balls": 5,
        "team": [
            {"pokemon_id": 100, "name": "voltorb", "level": 50},
            {"pokemon_id": 26, "name": "raichu", "level": 50},
            {"pokemon_id": 125, "name": "electabuzz", "level": 50},
        ]
    },
    4: {
        "id": 4,
        "region": "johto",
        "name": "Falkner",
        "gym": "Violet City Gym",
        "badge": "Zephyr Badge",
        "specialty": "flying",
        "reward_coins": 500,
        "reward_pokeballs": 5,
        "reward_great_balls": 0,
        "team": [
            {"pokemon_id": 21, "name": "spearow", "level": 50},
            {"pokemon_id": 17, "name": "pidgeotto", "level": 50},
        ]
    },
    5: {
        "id": 5,
        "region": "johto",
        "name": "Bugsy",
        "gym": "Azalea Town Gym",
        "badge": "Hive Badge",
        "specialty": "bug",
        "reward_coins": 700,
        "reward_pokeballs": 5,
        "reward_great_balls": 3,
        "team": [
            {"pokemon_id": 14, "name": "kakuna", "level": 50},
            {"pokemon_id": 123, "name": "scyther", "level": 50},
            {"pokemon_id": 15, "name": "beedrill", "level": 50},
        ]
    },
    6: {
        "id": 6,
        "region": "johto",
        "name": "Whitney",
        "gym": "Goldenrod City Gym",
        "badge": "Plain Badge",
        "specialty": "normal",
        "reward_coins": 900,
        "reward_pokeballs": 5,
        "reward_great_balls": 5,
        "team": [
            {"pokemon_id": 39, "name": "clefairy", "level": 50},
            {"pokemon_id": 241, "name": "miltank", "level": 50},
        ]
    },
    7: {
        "id": 7,
        "region": "hoenn",
        "name": "Roxanne",
        "gym": "Rustboro City Gym",
        "badge": "Stone Badge",
        "specialty": "rock",
        "reward_coins": 500,
        "reward_pokeballs": 5,
        "reward_great_balls": 0,
        "team": [
            {"pokemon_id": 74, "name": "geodude", "level": 50},
            {"pokemon_id": 345, "name": "lileep", "level": 50},
            {"pokemon_id": 219, "name": "magcargo", "level": 50},
        ]
    },
    8: {
        "id": 8,
        "region": "hoenn",
        "name": "Brawly",
        "gym": "Dewford Town Gym",
        "badge": "Knuckle Badge",
        "specialty": "fighting",
        "reward_coins": 700,
        "reward_pokeballs": 5,
        "reward_great_balls": 3,
        "team": [
            {"pokemon_id": 66, "name": "machop", "level": 50},
            {"pokemon_id": 296, "name": "makuhita", "level": 50},
            {"pokemon_id": 67, "name": "machoke", "level": 50},
        ]
    },
    9: {
        "id": 9,
        "region": "hoenn",
        "name": "Wattson",
        "gym": "Mauville City Gym",
        "badge": "Dynamo Badge",
        "specialty": "electric",
        "reward_coins": 900,
        "reward_pokeballs": 5,
        "reward_great_balls": 5,
        "team": [
            {"pokemon_id": 81, "name": "magnemite", "level": 50},
            {"pokemon_id": 82, "name": "magneton", "level": 50},
            {"pokemon_id": 310, "name": "manectric", "level": 50},
        ]
    },
}

TYPE_CHART = {
    "normal": {"rock": 0.5, "ghost": 0, "steel": 0.5},
    "fire": {"fire": 0.5, "water": 0.5, "grass": 2, "ice": 2, "bug": 2, "rock": 0.5, "dragon": 0.5, "steel": 2},
    "water": {"fire": 2, "water": 0.5, "grass": 0.5, "ground": 2, "rock": 2, "dragon": 0.5},
    "electric": {"water": 2, "electric": 0.5, "grass": 0.5, "ground": 0, "flying": 2, "dragon": 0.5},
    "grass": {"fire": 0.5, "water": 2, "grass": 0.5, "poison": 0.5, "ground": 2, "flying": 0.5, "bug": 0.5, "rock": 2, "dragon": 0.5, "steel": 0.5},
    "ice": {"water": 0.5, "grass": 2, "ice": 0.5, "ground": 2, "flying": 2, "dragon": 2, "steel": 0.5},
    "fighting": {"normal": 2, "ice": 2, "poison": 0.5, "flying": 0.5, "psychic": 0.5, "bug": 0.5, "rock": 2, "ghost": 0, "dark": 2, "steel": 2},
    "poison": {"grass": 2, "poison": 0.5, "ground": 0.5, "rock": 0.5, "ghost": 0.5, "steel": 0},
    "ground": {"fire": 2, "electric": 2, "grass": 0.5, "poison": 2, "flying": 0, "bug": 0.5, "rock": 2, "steel": 2},
    "flying": {"electric": 0.5, "grass": 2, "fighting": 2, "bug": 2, "rock": 0.5, "steel": 0.5},
    "psychic": {"fighting": 2, "poison": 2, "psychic": 0.5, "dark": 0, "steel": 0.5},
    "bug": {"fire": 0.5, "grass": 2, "fighting": 0.5, "poison": 0.5, "flying": 0.5, "psychic": 2, "ghost": 0.5, "dark": 2, "steel": 0.5},
    "rock": {"fire": 2, "ice": 2, "fighting": 0.5, "ground": 0.5, "flying": 2, "bug": 2, "steel": 0.5},
    "ghost": {"normal": 0, "psychic": 2, "ghost": 2, "dark": 0.5},
    "dragon": {"dragon": 2, "steel": 0.5},
    "dark": {"fighting": 0.5, "psychic": 2, "ghost": 2, "dark": 0.5, "steel": 0.5},
    "steel": {"fire": 0.5, "water": 0.5, "electric": 0.5, "ice": 2, "rock": 2, "steel": 0.5},
}

POTION_DATA = {
    "potion": {"field": "potions", "heal": 50},
    "super_potion": {"field": "super_potions", "heal": 100},
    "max_potion": {"field": "max_potions", "heal": None},  # None means full heal
}

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

def get_or_create_progress(user_id: int, db: Session):
    progress = db.query(PlayerProgress).filter(PlayerProgress.user_id == user_id).first()
    if not progress:
        progress = PlayerProgress(user_id=user_id)
        db.add(progress)
        db.commit()
        db.refresh(progress)
    return progress

def calculate_damage(attacker_stats, move_power, move_type, defender_types, level=50):
    attack = attacker_stats.get("attack", 50)
    defense = 50
    power = move_power or 40
    damage = ((2 * level / 5 + 2) * power * attack / defense) / 50 + 2
    multiplier = 1.0
    for def_type in defender_types:
        multiplier *= TYPE_CHART.get(move_type, {}).get(def_type, 1.0)
    return max(1, int(damage * multiplier))

def calculate_max_hp(base_hp, level=50):
    return int((2 * base_hp * level) / 100 + level + 10)

async def get_pokemon_moves(pokemon_id: int):
    async with httpx.AsyncClient(timeout=10) as client:
        res = await client.get(f"https://pokeapi.co/api/v2/pokemon/{pokemon_id}")
        if res.status_code != 200:
            return []
        data = res.json()
        moves = []
        for m in data["moves"][:4]:
            move_res = await client.get(m["move"]["url"])
            if move_res.status_code != 200:
                continue
            move_data = move_res.json()
            if move_data.get("power"):
                moves.append({
                    "name": move_data["name"],
                    "power": move_data["power"],
                    "type": move_data["type"]["name"],
                    "pp": move_data["pp"],
                })
        return moves

def save_session(user_id: int, state: dict, db: Session):
    session = db.query(BattleSession).filter(BattleSession.user_id == user_id).first()
    if session:
        session.state = state
        session.updated_at = datetime.utcnow()
    else:
        session = BattleSession(user_id=user_id, state=state)
        db.add(session)
    db.commit()

def load_session(user_id: int, db: Session):
    session = db.query(BattleSession).filter(BattleSession.user_id == user_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="No active battle session found")
    return session.state

def delete_session(user_id: int, db: Session):
    session = db.query(BattleSession).filter(BattleSession.user_id == user_id).first()
    if session:
        db.delete(session)
        db.commit()

def get_inventory_counts(progress):
    return {
        "potions": progress.potions,
        "super_potions": progress.super_potions,
        "max_potions": progress.max_potions,
    }

@router.get("/battle/gyms")
def get_gyms(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)
    progress = get_or_create_progress(user.id, db)
    earned_badges = [b.gym_id for b in db.query(Badge).filter(Badge.user_id == user.id).all()]
    result = []
    for gym_id, gym in GYMS.items():
        result.append({
            **gym,
            "unlocked": gym_id <= progress.current_gym,
            "completed": gym_id in earned_badges,
        })
    return result

@router.get("/battle/progress")
def get_progress(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)
    progress = get_or_create_progress(user.id, db)
    badges = db.query(Badge).filter(Badge.user_id == user.id).all()
    return {
        "current_gym": progress.current_gym,
        "coins": progress.coins,
        "pokeballs": progress.pokeballs,
        "great_balls": progress.great_balls,
        "ultra_balls": progress.ultra_balls,
        "potions": progress.potions,
        "super_potions": progress.super_potions,
        "max_potions": progress.max_potions,
        "badges": [{"gym_id": b.gym_id, "badge_name": b.badge_name} for b in badges],
    }

@router.post("/battle/start/{gym_id}")
async def start_battle(gym_id: int, body: dict, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)
    progress = get_or_create_progress(user.id, db)

    if gym_id > progress.current_gym:
        raise HTTPException(status_code=400, detail="You must beat previous gyms first!")

    gym = GYMS.get(gym_id)
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")

    pokemon_ids = body.get("pokemon_ids", [])
    if not pokemon_ids or len(pokemon_ids) > 5:
        raise HTTPException(status_code=400, detail="Select 1 to 5 pokemon")

    player_team = []
    for pid in pokemon_ids:
        caught = db.query(CaughtPokemon).filter(
            CaughtPokemon.user_id == user.id,
            CaughtPokemon.pokemon_id == pid
        ).first()
        if not caught:
            raise HTTPException(status_code=400, detail=f"You haven't caught pokemon {pid}")
        pokemon = db.query(Pokemon).filter(Pokemon.id == pid).first()
        max_hp = calculate_max_hp(pokemon.stats.get("hp", 45))
        moves = await get_pokemon_moves(pid)
        player_team.append({
            "pokemon_id": pid,
            "name": pokemon.name,
            "sprite": pokemon.sprite,
            "types": pokemon.types,
            "stats": pokemon.stats,
            "max_hp": max_hp,
            "current_hp": max_hp,
            "moves": moves,
        })

    gym_team = []
    for member in gym["team"]:
        pokemon = db.query(Pokemon).filter(Pokemon.id == member["pokemon_id"]).first()
        if not pokemon:
            continue
        max_hp = calculate_max_hp(pokemon.stats.get("hp", 45))
        moves = await get_pokemon_moves(member["pokemon_id"])
        gym_team.append({
            "pokemon_id": member["pokemon_id"],
            "name": pokemon.name,
            "sprite": pokemon.sprite,
            "types": pokemon.types,
            "stats": pokemon.stats,
            "max_hp": max_hp,
            "current_hp": max_hp,
            "moves": moves,
        })

    state = {
        "gym_id": gym_id,
        "gym_name": gym["gym"],
        "leader_name": gym["name"],
        "player_team": player_team,
        "gym_team": gym_team,
        "active_player_index": 0,
        "active_gym_index": 0,
        "turn": "player",
        "log": [f"You challenged {gym['name']} of {gym['gym']}!"],
        "battle_over": False,
        "winner": None,
        **get_inventory_counts(progress),
    }

    save_session(user.id, state, db)
    return state

@router.post("/battle/move")
async def battle_move(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)
    progress = get_or_create_progress(user.id, db)

    body = await request.json()
    action = body.get("action")
    move_index = body.get("move_index", 0)
    potion_type = body.get("potion_type", "potion")

    state = load_session(user.id, db)

    gym_id = state["gym_id"]
    player_team = state["player_team"]
    gym_team = state["gym_team"]
    active_player_index = state["active_player_index"]
    active_gym_index = state["active_gym_index"]
    log = state["log"]

    gym = GYMS.get(gym_id)
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")

    player_pokemon = player_team[active_player_index]
    gym_pokemon = gym_team[active_gym_index]

    # Handle potion
    if action == "potion":
        potion = POTION_DATA.get(potion_type, POTION_DATA["potion"])
        count = getattr(progress, potion["field"])

        if count <= 0:
            log.append(f"No {potion_type.replace('_', ' ')}s left!")
        else:
            setattr(progress, potion["field"], count - 1)
            heal = potion["heal"] if potion["heal"] is not None else player_pokemon["max_hp"]
            player_pokemon["current_hp"] = min(
                player_pokemon["max_hp"],
                player_pokemon["current_hp"] + heal
            )
            db.commit()
            log.append(f"{player_pokemon['name'].capitalize()} restored {heal} HP!")

    # Handle move
    elif action == "move":
        moves = player_pokemon.get("moves", [])
        if not moves:
            move = {"name": "tackle", "power": 40, "type": "normal"}
        else:
            move = moves[move_index % len(moves)]

        damage = calculate_damage(
            player_pokemon["stats"],
            move["power"],
            move["type"],
            gym_pokemon["types"],
        )
        gym_pokemon["current_hp"] = max(0, gym_pokemon["current_hp"] - damage)
        log.append(f"{player_pokemon['name'].capitalize()} used {move['name']}! Dealt {damage} damage!")

        if gym_pokemon["current_hp"] == 0:
            log.append(f"{gym_pokemon['name'].capitalize()} fainted!")
            active_gym_index += 1

            if active_gym_index >= len(gym_team):
                already_won = db.query(Badge).filter(
                    Badge.user_id == user.id,
                    Badge.gym_id == gym_id
                ).first()
                if not already_won:
                    badge = Badge(user_id=user.id, gym_id=gym_id, badge_name=gym["badge"])
                    db.add(badge)
                    progress.coins += gym["reward_coins"]
                    progress.pokeballs += gym["reward_pokeballs"]
                    progress.great_balls += gym["reward_great_balls"]
                    if progress.current_gym == gym_id:
                        progress.current_gym += 1
                    db.commit()

                log.append(f"You defeated {gym['name']}! You earned the {gym['badge']}!")
                log.append(f"You received {gym['reward_coins']} coins!")

                state.update({
                    "player_team": player_team,
                    "gym_team": gym_team,
                    "active_player_index": active_player_index,
                    "active_gym_index": active_gym_index,
                    "log": log,
                    "battle_over": True,
                    "winner": "player",
                    **get_inventory_counts(progress),
                })
                delete_session(user.id, db)
                return state
            else:
                log.append(f"{gym['name']} sent out {gym_team[active_gym_index]['name'].capitalize()}!")

    # Handle switch
    elif action == "switch":
        switch_index = body.get("switch_index", 0)
        if switch_index != active_player_index and player_team[switch_index]["current_hp"] > 0:
            active_player_index = switch_index
            log.append(f"Go, {player_team[active_player_index]['name'].capitalize()}!")
            player_pokemon = player_team[active_player_index]

    # Gym leader AI turn
    gym_pokemon = gym_team[active_gym_index]
    player_pokemon = player_team[active_player_index]

    gym_moves = gym_pokemon.get("moves", [])
    if not gym_moves:
        gym_move = {"name": "tackle", "power": 40, "type": "normal"}
    else:
        if random.random() < 0.7:
            gym_move = max(gym_moves, key=lambda m: m.get("power", 0))
        else:
            gym_move = random.choice(gym_moves)

    gym_damage = calculate_damage(
        gym_pokemon["stats"],
        gym_move["power"],
        gym_move["type"],
        player_pokemon["types"],
    )
    player_pokemon["current_hp"] = max(0, player_pokemon["current_hp"] - gym_damage)
    log.append(f"{gym['name']}'s {gym_pokemon['name'].capitalize()} used {gym_move['name']}! Dealt {gym_damage} damage!")

    if player_pokemon["current_hp"] == 0:
        log.append(f"{player_pokemon['name'].capitalize()} fainted!")
        active_player_index += 1

        if active_player_index >= len(player_team):
            log.append(f"You lost to {gym['name']}! Try again!")
            state.update({
                "player_team": player_team,
                "gym_team": gym_team,
                "active_player_index": active_player_index,
                "active_gym_index": active_gym_index,
                "log": log,
                "battle_over": True,
                "winner": "gym",
                **get_inventory_counts(progress),
            })
            delete_session(user.id, db)
            return state
        else:
            log.append(f"Go, {player_team[active_player_index]['name'].capitalize()}!")

    state.update({
        "player_team": player_team,
        "gym_team": gym_team,
        "active_player_index": active_player_index,
        "active_gym_index": active_gym_index,
        "log": log,
        "battle_over": False,
        "winner": None,
        **get_inventory_counts(progress),
    })
    save_session(user.id, state, db)
    return state

@router.post("/battle/switch")
async def switch_pokemon(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)
    body = await request.json()
    switch_index = body.get("switch_index", 0)

    state = load_session(user.id, db)
    player_team = state["player_team"]
    log = state["log"]

    if switch_index == state["active_player_index"]:
        return state
    if player_team[switch_index]["current_hp"] <= 0:
        raise HTTPException(status_code=400, detail="That pokemon has fainted!")

    state["active_player_index"] = switch_index
    log.append(f"Go, {player_team[switch_index]['name'].capitalize()}!")
    state["log"] = log

    save_session(user.id, state, db)
    return state