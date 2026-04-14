import api from './client'

export interface Product {
  id_produto: string
  nome_produto: string
  categoria_produto: string
  peso_produto_gramas: number | null
  comprimento_centimetros: number | null
  altura_centimetros: number | null
  largura_centimetros: number | null
}

export interface Review {
  id_avaliacao: string
  id_pedido: string
  avaliacao: number
  titulo_comentario: string | null
  comentario: string | null
  data_comentario: string | null
  data_resposta: string | null
}

export interface ProductDetail extends Product {
  media_avaliacao: number | null
  total_vendas: number
  receita_total: number
  avaliacoes?: Review[]
}

export const fetcher = async (url: string) => {
  const response = await api.get(url)
  return response.data
}

export interface ProductCreate {
  nome_produto: string
  categoria_produto: string
  peso_produto_gramas?: number | null
  comprimento_centimetros?: number | null
  altura_centimetros?: number | null
  largura_centimetros?: number | null
}

export interface ProductUpdate {
  nome_produto?: string
  categoria_produto?: string
  peso_produto_gramas?: number | null
  comprimento_centimetros?: number | null
  altura_centimetros?: number | null
  largura_centimetros?: number | null
}

export const productsApi = {
  list: async (params?: { search?: string; categoria?: string; skip?: number; limit?: number }) => {
    const response = await api.get<Product[]>('/produto/', { params })
    return response.data
  },

  getCategories: async () => {
    const response = await api.get<string[]>('/produto/categorias')
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get<ProductDetail>(`/produto/${id}`)
    return response.data
  },

  create: async (data: ProductCreate) => {
    const response = await api.post<Product>('/produto/', data)
    return response.data
  },

  update: async (id: string, data: ProductUpdate) => {
    const response = await api.patch<Product>(`/produto/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await api.delete(`/produto/${id}`)
  },
}
