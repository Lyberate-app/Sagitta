import { http, HttpResponse } from 'msw'
import { Empleado, SlotDisponible } from '@/types'
import { storageService } from '@/services/storage.service'
import { BASE } from '../base'

const generarSlots = (fecha: string): SlotDisponible[] => {
  const horas = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
  ]
  const seed = fecha.charCodeAt(fecha.length - 1) + fecha.charCodeAt(fecha.length - 2)
  return horas.map((h, i) => ({
    hora_inicio: h,
    hora_fin: horas[i + 1] ?? '18:30',
    disponible: (seed + i) % 4 !== 0,
  }))
}

export const empleadosHandlers = [
  // GET /api/empleados
  http.get(`${BASE}/empleados`, () => {
    const list = storageService.getEmpleados()
    return HttpResponse.json({
      success: true,
      message: 'OK',
      data: list,
      meta: { total: list.length, per_page: 50, current_page: 1, last_page: 1 },
    })
  }),

  // GET /api/empleados/:id
  http.get(`${BASE}/empleados/:id`, ({ params }) => {
    const list = storageService.getEmpleados()
    const empleado = list.find((e) => e.id === Number(params.id)) ?? list[0]
    return HttpResponse.json({ success: true, message: 'OK', data: empleado })
  }),

  // POST /api/empleados
  http.post(`${BASE}/empleados`, async ({ request }) => {
    const body = (await request.json()) as Partial<Empleado>
    const nuevo = storageService.addEmpleado(body)
    return HttpResponse.json(
      { success: true, message: 'Empleado creado con éxito', data: nuevo },
      { status: 201 }
    )
  }),

  // PUT /api/empleados/:id
  http.put(`${BASE}/empleados/:id`, async ({ params, request }) => {
    const id = Number(params.id)
    const body = (await request.json()) as Partial<Empleado>
    const actualizado = storageService.updateEmpleado(id, body)
    return HttpResponse.json({ success: true, message: 'Empleado actualizado', data: actualizado })
  }),

  // DELETE /api/empleados/:id
  http.delete(`${BASE}/empleados/:id`, ({ params }) => {
    const id = Number(params.id)
    storageService.deleteEmpleado(id)
    return HttpResponse.json({ success: true, message: 'Empleado eliminado' })
  }),

  // GET /api/empleados/:id/horario
  http.get(`${BASE}/empleados/:id/horario`, ({ params }) => {
    const list = storageService.getEmpleados()
    const empleado = list.find((e) => e.id === Number(params.id))
    return HttpResponse.json({ success: true, message: 'OK', data: empleado?.horarios ?? [] })
  }),

  // GET /api/empleados/:id/disponibilidad
  http.get(`${BASE}/empleados/:id/disponibilidad`, ({ request }) => {
    const url = new URL(request.url)
    const fecha = url.searchParams.get('fecha') ?? new Date().toISOString().slice(0, 10)
    return HttpResponse.json({
      success: true,
      message: 'OK',
      data: { fecha, slots: generarSlots(fecha) },
    })
  }),
]
