from pydantic import BaseModel, ConfigDict

class ItemPedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_pedido: str
    id_item: int
    id_produto: str
    id_vendedor: str
    preco_BRL: float
    preco_frete: float