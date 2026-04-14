from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional

from app.database import get_db
from app.models.pedido import Pedido
from app.schemas.pedido import PedidoRead, PedidoDetail
from app.schemas.consumidor import ConsumidorRead
from app.schemas.item_pedido import ItemPedidoRead
from app.schemas.avaliacao_pedido import AvaliacaoPedidoRead

router = APIRouter(prefix="/pedido", tags=["Pedido"])


@router.get("/", response_model=list[PedidoRead])
def listar_pedidos(
    status: Optional[str] = Query(None, description="Filtrar por status"),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    query = db.query(Pedido)

    if status:
        query = query.filter(Pedido.status == status)

    return query.offset(skip).limit(limit).all()


@router.get("/{id_pedido}", response_model=PedidoDetail)
def detalhar_pedido(id_pedido: str, db: Session = Depends(get_db)):
    pedido = (
        db.query(Pedido)
        .options(
            joinedload(Pedido.consumidor),
            joinedload(Pedido.itens),
            joinedload(Pedido.avaliacao),
        )
        .filter(Pedido.id_pedido == id_pedido)
        .first()
    )

    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    return PedidoDetail(
        **PedidoRead.model_validate(pedido).model_dump(),
        consumidor=ConsumidorRead.model_validate(pedido.consumidor) if pedido.consumidor else None,
        itens=[ItemPedidoRead.model_validate(item) for item in pedido.itens],
        avaliacao=AvaliacaoPedidoRead.model_validate(pedido.avaliacao) if pedido.avaliacao else None,
    )