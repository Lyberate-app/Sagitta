import { http, HttpResponse } from 'msw'
import { Cita, SlotDisponible } from '@/types'
import { storageService } from '@/services/storage.service'
import { BASE } from '../base'

const generarSlots = (): SlotDisponible[] =>
  ['09:00', '09:40', '10:30', '11:15', '12:00', '14:30', '15:15', '16:00', '16:45', '17:30', '18:15'].map(
    (h, idx) => ({
      hora_inicio: h,
      hora_fin: `${String(parseInt(h) + 1).padStart(2, '0')}:${h.split(':')[1]}`,
      disponible: idx % 4 !== 0,
    })
  )

export const citasHandlers = [
  // GET /api/citas
  http.get(`${BASE}/citas`, () => {
    const list = storageService.getCitas()
    return HttpResponse.json({
      success: true,
      message: 'OK',
      data: list,
      meta: { total: list.length, per_page: 50, current_page: 1, last_page: 1 },
    })
  }),

  // GET /api/citas/:id
  http.get(`${BASE}/citas/:id`, ({ params }) => {
    const list = storageService.getCitas()
    const cita = list.find((c) => c.id === Number(params.id)) ?? list[0]
    return HttpResponse.json({ success: true, message: 'OK', data: cita })
  }),

  // POST /api/citas
  http.post(`${BASE}/citas`, async ({ request }) => {
    const body = (await request.json()) as Partial<Cita>
    const nueva = storageService.addCita(body)
    return HttpResponse.json({ success: true, message: 'Cita creada con éxito', data: nueva }, { status: 201 })
  }),

  // PUT /api/citas/:id
  http.put(`${BASE}/citas/:id`, async ({ params, request }) => {
    const id = Number(params.id)
    const body = (await request.json()) as Partial<Cita>
    const actualizada = storageService.updateCita(id, body)
    return HttpResponse.json({ success: true, message: 'Cita actualizada', data: actualizada })
  }),

  // DELETE /api/citas/:id
  http.delete(`${BASE}/citas/:id`, ({ params }) => {
    const id = Number(params.id)
    storageService.cancelCita(id)
    return HttpResponse.json({ success: true, message: 'Cita cancelada correctamente' })
  }),

  // GET /api/citas/disponibilidad
  http.get(`${BASE}/citas/disponibilidad`, () => {
    return HttpResponse.json({ success: true, message: 'OK', data: generarSlots() })
  }),
]
