from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.consumidor import Consumidor
from app.schemas.consumidor import ConsumidorRead

router = APIRouter(prefix="/consumidor", tags=["Consumidor"])


@router.get("/", response_model=list[ConsumidorRead])
def listar_consumidores(
    search: Optional[str] = Query(None, description="Busca por nome"),
    cidade: Optional[str] = Query(None),
    estado: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    query = db.query(Consumidor)

    if search:
        query = query.filter(Consumidor.nome_consumidor.ilike(f"%{search}%"))
    if cidade:
        query = query.filter(Consumidor.cidade == cidade)
    if estado:
        query = query.filter(Consumidor.estado == estado)

    return query.offset(skip).limit(limit).all()


@router.get("/{id_consumidor}", response_model=ConsumidorRead)
def detalhar_consumidor(id_consumidor: str, db: Session = Depends(get_db)):
    consumidor = db.query(Consumidor).filter(Consumidor.id_consumidor == id_consumidor).first()
    if not consumidor:
        raise HTTPException(status_code=404, detail="Consumidor não encontrado")
    return consumidor