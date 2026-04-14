from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.item_pedido import ItemPedido
from app.schemas.item_pedido import ItemPedidoRead

router = APIRouter(prefix="/item-pedido", tags=["Itens de Pedido"])


@router.get("/", response_model=list[ItemPedidoRead])
def listar_itens(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    return db.query(ItemPedido).offset(skip).limit(limit).all()


@router.get("/{id_pedido}/{id_item}", response_model=ItemPedidoRead)
def detalhar_item(id_pedido: str, id_item: int, db: Session = Depends(get_db)):
    item = db.query(ItemPedido).filter(
        ItemPedido.id_pedido == id_pedido,
        ItemPedido.id_item == id_item,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    return item