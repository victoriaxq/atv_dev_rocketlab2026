from .produto import ProdutoCreate, ProdutoUpdate, ProdutoRead, ProdutoDetail
from .pedido import PedidoRead, PedidoDetail
from .consumidor import ConsumidorRead
from .item_pedido import ItemPedidoRead
from .avaliacao_pedido import AvaliacaoPedidoRead
from .vendedor import VendedorRead

__all__ = [
    "ProdutoCreate",
    "ProdutoUpdate",
    "ProdutoRead",
    "ProdutoDetail",
    "PedidoRead",
    "PedidoDetail",
    "ConsumidorRead",
    "ItemPedidoRead",
    "AvaliacaoPedidoRead",
    "VendedorRead",
]