import { apiClient } from './api.client'
import { Cliente } from '@/types'

export const clientesService = {
  getAll: (q?: string) => apiClient.get<Cliente[]>(`/clientes${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  getById: (id: number) => apiClient.get<Cliente>(`/clientes/${id}`),
  create: (data: Partial<Cliente>) => apiClient.post<Cliente>('/clientes', data),
  update: (id: number, data: Partial<Cliente>) => apiClient.put<Cliente>(`/clientes/${id}`, data),
}

