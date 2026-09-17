import { apiClient } from './api.client'
import { Empleado, HorarioEmpleado, DisponibilidadDia } from '@/types'

export const empleadosService = {
  getAll: () => apiClient.get<Empleado[]>('/empleados'),
  getById: (id: number) => apiClient.get<Empleado>(`/empleados/${id}`),
  create: (data: Partial<Empleado>) => apiClient.post<Empleado>('/empleados', data),
  update: (id: number, data: Partial<Empleado>) => apiClient.put<Empleado>(`/empleados/${id}`, data),
  delete: (id: number) => apiClient.delete<void>(`/empleados/${id}`),
  getHorario: (id: number) => apiClient.get<HorarioEmpleado[]>(`/empleados/${id}/horario`),
  getDisponibilidad: (id: number, fecha: string) =>
    apiClient.get<DisponibilidadDia>(`/empleados/${id}/disponibilidad?fecha=${fecha}`),
}
