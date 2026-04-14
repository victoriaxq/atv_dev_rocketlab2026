import api from './client'
import type { AvaliacaoRead } from '@/types'

export const avaliacoesApi = {
  listar: (params?: { nota?: number; id_produto?: string; skip?: number; limit?: number }) =>
    api.get<AvaliacaoRead[]>('/avaliacao/', { params }),

  detalhar: (id: string) =>
    api.get<AvaliacaoRead>(`/avaliacao/${id}`),
}