import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.produto import Produto
from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.schemas.produto import ProdutoCreate, ProdutoListResponse, ProdutoUpdate, ProdutoRead, ProdutoDetail
from app.schemas.avaliacao_pedido import AvaliacaoPedidoRead

router = APIRouter(prefix="/produto", tags=["Produto"])


@router.get("/", response_model=ProdutoListResponse)
def listar_produtos(
    search: Optional[str] = Query(None),
    categoria: Optional[List[str]] = Query(None),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    query = db.query(Produto)
    if search:
        query = query.filter(Produto.nome_produto.ilike(f"%{search}%"))
    if categoria:
        query = query.filter(Produto.categoria_produto.in_(categoria))

    total = query.count()
    items = query.offset(skip).limit(limit).all()

    return {"items": items, "total": total}


@router.get("/categorias", response_model=list[str])
def listar_categorias(db: Session = Depends(get_db)):
    resultado = db.query(Produto.categoria_produto).distinct().all()
    return [r[0] for r in resultado]


@router.get("/{id_produto}", response_model=ProdutoDetail)
def detalhar_produto(id_produto: str, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    # busca itens com pedido e avaliação já carregados (evita N+1 queries)
    itens = (
        db.query(ItemPedido)
        .options(joinedload(ItemPedido.pedido).joinedload(Pedido.avaliacao))
        .filter(ItemPedido.id_produto == id_produto)
        .all()
    )

    avaliacoes_notas = []
    avaliacoes_out = []
    receita = 0.0

    for item in itens:
        receita += item.preco_BRL
        if item.pedido.avaliacao:
            avaliacoes_notas.append(item.pedido.avaliacao.avaliacao)
            avaliacoes_out.append(
                AvaliacaoPedidoRead.model_validate(item.pedido.avaliacao)
            )

    media = (
        round(sum(avaliacoes_notas) / len(avaliacoes_notas), 1)
        if avaliacoes_notas else None
    )

    return ProdutoDetail(
        **ProdutoRead.model_validate(produto).model_dump(),
        media_avaliacao=media,
        total_vendas=len(itens),
        receita_total=round(receita, 2),
        avaliacoes=avaliacoes_out,
    )


@router.post("/", response_model=ProdutoRead, status_code=201)
def criar_produto(data: ProdutoCreate, db: Session = Depends(get_db)):
    produto = Produto(
        id_produto=uuid.uuid4().hex,
        **data.model_dump()
    )
    db.add(produto)
    db.commit()
    db.refresh(produto)
    return produto


@router.patch("/{id_produto}", response_model=ProdutoRead)
def atualizar_produto(
    id_produto: str,
    data: ProdutoUpdate,
    db: Session = Depends(get_db)
):
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    for campo, valor in data.model_dump(exclude_unset=True).items():
        setattr(produto, campo, valor)

    db.commit()
    db.refresh(produto)
    return produto


@router.delete("/{id_produto}", status_code=204)
def remover_produto(id_produto: str, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    try:
        db.delete(produto)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Produto não pode ser removido pois possui pedidos vinculados"
        )