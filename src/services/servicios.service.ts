import { apiClient } from './api.client'
import { Servicio, CategoriaServicio } from '@/types'

export const serviciosService = {
  getAll: () => apiClient.get<Servicio[]>('/servicios'),
  getById: (id: number) => apiClient.get<Servicio>(`/servicios/${id}`),
  getCategorias: () => apiClient.get<CategoriaServicio[]>('/categorias-servicio'),
  create: (data: Partial<Servicio>) => apiClient.post<Servicio>('/servicios', data),
  update: (id: number, data: Partial<Servicio>) => apiClient.put<Servicio>(`/servicios/${id}`, data),
  delete: (id: number) => apiClient.delete<void>(`/servicios/${id}`),
}

