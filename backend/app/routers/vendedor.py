from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.vendedor import Vendedor
from app.schemas.vendedor import VendedorRead

router = APIRouter(prefix="/vendedor", tags=["Vendedor"])


@router.get("/", response_model=list[VendedorRead])
def listar_vendedores(
    search: Optional[str] = Query(None, description="Busca por nome"),
    cidade: Optional[str] = Query(None),
    estado: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    query = db.query(Vendedor)

    if search:
        query = query.filter(Vendedor.nome_vendedor.ilike(f"%{search}%"))
    if cidade:
        query = query.filter(Vendedor.cidade == cidade)
    if estado:
        query = query.filter(Vendedor.estado == estado)

    return query.offset(skip).limit(limit).all()


@router.get("/{id_vendedor}", response_model=VendedorRead)
def detalhar_vendedor(id_vendedor: str, db: Session = Depends(get_db)):
    vendedor = db.query(Vendedor).filter(Vendedor.id_vendedor == id_vendedor).first()
    if not vendedor:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    return vendedor