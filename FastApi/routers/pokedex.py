from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.models import Pokemon

router = APIRouter()

REGIONS = {
    "kanto": (1, 151),
    "johto": (152, 251),
    "hoenn": (252, 386),
}

@router.get("/pokedex")
def get_pokedex(
    search: str = None,
    type: str = None,
    region: str = None,
    limit: int = 24,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(Pokemon)

    if search:
        query = query.filter(Pokemon.name.contains(search.lower()))
    if type:
        query = query.filter(Pokemon.types.contains(type.lower()))
    if region and region.lower() in REGIONS:
        start, end = REGIONS[region.lower()]
        query = query.filter(Pokemon.id >= start, Pokemon.id <= end)

    total = query.count()
    pokemon = query.offset(offset).limit(limit).all()

    return {
        "total": total,
        "pokemon": [
            {
                "id": p.id,
                "name": p.name,
                "types": p.types,
                "sprite": p.sprite,
            }
            for p in pokemon
        ]
    }

@router.get("/pokedex/{pokemon_id}")
def get_pokemon(pokemon_id: int, db: Session = Depends(get_db)):
    pokemon = db.query(Pokemon).filter(Pokemon.id == pokemon_id).first()
    if not pokemon:
        raise HTTPException(status_code=404, detail="Pokemon not found")
    return {
        "id": pokemon.id,
        "name": pokemon.name,
        "types": pokemon.types,
        "sprite": pokemon.sprite,
        "stats": pokemon.stats,
        "abilities": pokemon.abilities,
        "moves": pokemon.moves,
        "height": pokemon.height,
        "weight": pokemon.weight,
        "base_experience": pokemon.base_experience,
    }