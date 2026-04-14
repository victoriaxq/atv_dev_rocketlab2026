from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class AvaliacaoPedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_avaliacao: str
    id_pedido: str
    avaliacao: int
    titulo_comentario: Optional[str] = None
    comentario: Optional[str] = None
    data_comentario: Optional[datetime] = None
    data_resposta: Optional[datetime] = None