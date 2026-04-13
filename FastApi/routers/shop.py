from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
from models.models import PlayerProgress, User
from auth.token import SECRET_KEY, ALGORITHM
from jose import jwt, JWTError

router = APIRouter()

SHOP_ITEMS = {
    "potion": {
        "name": "Potion",
        "description": "Restores 50 HP to a pokemon",
        "price": 50,
        "field": "potions",
    },
    "super_potion": {
        "name": "Super Potion",
        "description": "Restores 100 HP to a pokemon",
        "price": 100,
        "field": "super_potions",
    },
    "max_potion": {
        "name": "Max Potion",
        "description": "Fully restores HP to a pokemon",
        "price": 200,
        "field": "max_potions",
    },
    "pokeball": {
        "name": "Pokeball",
        "description": "A basic ball for catching pokemon",
        "price": 30,
        "field": "pokeballs",
    },
    "great_ball": {
        "name": "Great Ball",
        "description": "Better catch rate than a Pokeball",
        "price": 50,
        "field": "great_balls",
    },
    "ultra_ball": {
        "name": "Ultra Ball",
        "description": "High performance catch ball",
        "price": 80,
        "field": "ultra_balls",
    },
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
    progress = db.query(PlayerProgress).filter(
        PlayerProgress.user_id == user_id
    ).first()
    if not progress:
        progress = PlayerProgress(user_id=user_id)
        db.add(progress)
        db.commit()
        db.refresh(progress)
    return progress

@router.get("/shop/items")
def get_shop_items():
    return list(SHOP_ITEMS.items())

@router.get("/shop/inventory")
def get_inventory(request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)
    progress = get_or_create_progress(user.id, db)
    return {
        "coins": progress.coins,
        "potions": progress.potions,
        "super_potions": progress.super_potions,
        "max_potions": progress.max_potions,
        "pokeballs": progress.pokeballs,
        "great_balls": progress.great_balls,
        "ultra_balls": progress.ultra_balls,
    }

@router.post("/shop/buy/{item_id}")
async def buy_item(item_id: str, request: Request, db: Session = Depends(get_db)):
    user = get_current_user(request, db)
    progress = get_or_create_progress(user.id, db)

    body = await request.json()
    quantity = body.get("quantity", 1)

    if quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")

    item = SHOP_ITEMS.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    total_cost = item["price"] * quantity
    if progress.coins < total_cost:
        raise HTTPException(
            status_code=400,
            detail=f"Not enough coins! Need {total_cost}, have {progress.coins}"
        )

    progress.coins -= total_cost
    current = getattr(progress, item["field"])
    setattr(progress, item["field"], current + quantity)
    db.commit()

    return {
        "message": f"Bought {quantity}x {item['name']}!",
        "coins_spent": total_cost,
        "coins_remaining": progress.coins,
        "item": item["name"],
        "new_quantity": getattr(progress, item["field"]),
    }