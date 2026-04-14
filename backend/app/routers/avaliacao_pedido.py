from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.schemas.avaliacao_pedido import AvaliacaoPedidoRead

router = APIRouter(prefix="/avaliacao", tags=["Avaliação"])


@router.get("/", response_model=list[AvaliacaoPedidoRead])
def listar_avaliacoes(
    nota: Optional[int] = Query(None, description="Filtrar por nota (1 a 5)", ge=1, le=5),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    query = db.query(AvaliacaoPedido)

    if nota:
        query = query.filter(AvaliacaoPedido.avaliacao == nota)

    return query.offset(skip).limit(limit).all()


@router.get("/{id_avaliacao}", response_model=AvaliacaoPedidoRead)
def detalhar_avaliacao(id_avaliacao: str, db: Session = Depends(get_db)):
    avaliacao = db.query(AvaliacaoPedido).filter(AvaliacaoPedido.id_avaliacao == id_avaliacao).first()
    if not avaliacao:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    return avaliacao