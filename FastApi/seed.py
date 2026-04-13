import httpx
import asyncio
from database import SessionLocal
from models.models import Pokemon

async def seed():
    print("Starting seed...")
    db = SessionLocal()
    print("DB connected")
    async with httpx.AsyncClient(timeout=30) as client:
        for pokemon_id in range(1, 387):
            existing = db.query(Pokemon).filter(Pokemon.id == pokemon_id).first()
            if existing:
                print(f"Skipping {pokemon_id} — already in DB")
                continue
            try:
                print(f"Fetching pokemon {pokemon_id}...")
                pokemon = await fetch_pokemon(client, pokemon_id)
                db.add(pokemon)
                db.commit()
                print(f"Saved {pokemon.name}")
            except Exception as e:
                print(f"Failed on {pokemon_id}: {e}")
                db.rollback()

    db.close()
    print("Seeding complete!")

async def fetch_pokemon(client, pokemon_id):
    res = await client.get(f"https://pokeapi.co/api/v2/pokemon/{pokemon_id}")
    data = res.json()
    species_res = await client.get(f"https://pokeapi.co/api/v2/pokemon-species/{pokemon_id}")
    species_data = species_res.json()

    return Pokemon(
        id=data["id"],
        name=data["name"],
        types=[t["type"]["name"] for t in data["types"]],
        sprite=data["sprites"]["front_default"],
        stats={s["stat"]["name"]: s["base_stat"] for s in data["stats"]},
        abilities=[a["ability"]["name"] for a in data["abilities"]],
        moves=[m["move"]["name"] for m in data["moves"]],
        height=data["height"],
        weight=data["weight"],
        base_experience=data.get("base_experience"),
        capture_rate=species_data.get("capture_rate"),
    )

if __name__ == "__main__":
    asyncio.run(seed())