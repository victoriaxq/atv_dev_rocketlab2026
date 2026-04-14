from typing import Optional, TypeVar, Generic
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")

class ProdutoBase(BaseModel):
    nome_produto: str
    categoria_produto: str
    peso_produto_gramas: Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros: Optional[float] = None
    largura_centimetros: Optional[float] = None

class ProdutoCreate(ProdutoBase):
    pass  # id gerado no backend

class ProdutoUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    nome_produto: Optional[str] = None
    categoria_produto: Optional[str] = None
    peso_produto_gramas: Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros: Optional[float] = None
    largura_centimetros: Optional[float] = None


class ProdutoRead(ProdutoBase):
    model_config = ConfigDict(from_attributes=True)

    id_produto: str

class ProdutoListResponse(BaseModel):
    items: list[ProdutoRead]
    total: int
    
class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int

class ProdutoDetail(ProdutoRead):
    model_config = ConfigDict(from_attributes=True)

    media_avaliacao: Optional[float] = None
    total_vendas: int = 0
    receita_total: float = 0.0