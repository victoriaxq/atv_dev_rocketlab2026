import api from './client'
import type { ProdutoRead, ProdutoDetail, ProdutoCreate, ProdutoUpdate, PaginatedResponse } from '@/types'

export const produtosApi = {
  listar: (params?: { search?: string; categoria?: string[]; skip?: number; limit?: number }) =>
    api.get<PaginatedResponse<ProdutoRead>>('/produto/', { params }),

  detalhar: (id: string) =>
    api.get<ProdutoDetail>(`/produto/${id}`),

  listarCategorias: () =>
    api.get<string[]>('/produto/categorias'),

  criar: (data: ProdutoCreate) =>
    api.post<ProdutoRead>('/produto/', data),

  atualizar: (id: string, data: ProdutoUpdate) =>
    api.patch<ProdutoRead>(`/produto/${id}`, data),

  remover: (id: string) =>
    api.delete(`/produto/${id}`),
}