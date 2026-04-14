from typing import Optional, TYPE_CHECKING
from datetime import datetime, date
from pydantic import BaseModel, ConfigDict

from app.schemas.consumidor import ConsumidorRead
from app.schemas.item_pedido import ItemPedidoRead
from app.schemas.avaliacao_pedido import AvaliacaoPedidoRead


class PedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_pedido: str
    id_consumidor: str
    status: str
    pedido_compra_timestamp: Optional[datetime] = None
    pedido_entregue_timestamp: Optional[datetime] = None
    data_estimada_entrega: Optional[date] = None
    tempo_entrega_dias: Optional[float] = None
    tempo_entrega_estimado_dias: Optional[float] = None
    diferenca_entrega_dias: Optional[float] = None
    entrega_no_prazo: Optional[str] = None


class PedidoDetail(PedidoRead):
    model_config = ConfigDict(from_attributes=True)

    consumidor: Optional[ConsumidorRead] = None
    itens: list[ItemPedidoRead] = []
    avaliacao: Optional[AvaliacaoPedidoRead] = None