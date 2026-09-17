import { apiClient } from './api.client'
import { Cita, SlotDisponible } from '@/types'

export const citasService = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiClient.get<Cita[]>(`/citas${qs}`)
  },

  getById: (id: number) =>
    apiClient.get<Cita>(`/citas/${id}`),

  create: (data: Partial<Cita>) =>
    apiClient.post<Cita>('/citas', data),

  update: (id: number, data: Partial<Cita>) =>
    apiClient.put<Cita>(`/citas/${id}`, data),

  cancel: (id: number) =>
    apiClient.delete<void>(`/citas/${id}`),

  getDisponibilidad: (empleadoId: number, fecha: string, servicioId?: number): Promise<{ success: boolean; data?: SlotDisponible[] }> =>
    apiClient.get<SlotDisponible[]>(
      `/citas/disponibilidad?empleado_id=${empleadoId}&fecha=${fecha}${servicioId ? `&servicio_id=${servicioId}` : ''}`
    ),
}

