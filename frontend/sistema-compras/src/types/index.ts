export interface ProdutoRead {
  id_produto: string
  nome_produto: string
  categoria_produto: string
  peso_produto_gramas: number | null
  comprimento_centimetros: number | null
  altura_centimetros: number | null
  largura_centimetros: number | null
}

export interface ProdutoDetail extends ProdutoRead {
  media_avaliacao: number | null
  total_vendas: number
  receita_total: number
}

export interface ProdutoCreate {
  nome_produto: string
  categoria_produto: string
  peso_produto_gramas?: number | null
  comprimento_centimetros?: number | null
  altura_centimetros?: number | null
  largura_centimetros?: number | null
}

export interface ProdutoUpdate {
  nome_produto?: string | null
  categoria_produto?: string | null
  peso_produto_gramas?: number | null
  comprimento_centimetros?: number | null
  altura_centimetros?: number | null
  largura_centimetros?: number | null
}

export interface AvaliacaoRead {
  id_avaliacao: string
  id_pedido: string
  avaliacao: number
  titulo_comentario: string | null
  comentario: string | null
  data_comentario: string | null
  data_resposta: string | null
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
}