import { http, HttpResponse } from 'msw'
import { Servicio } from '@/types'
import { storageService } from '@/services/storage.service'
import { BASE } from '../base'

export const serviciosHandlers = [
  // GET /api/servicios
  http.get(`${BASE}/servicios`, () => {
    const data = storageService.getServicios()
    return HttpResponse.json({
      success: true,
      message: 'OK',
      data,
      meta: { total: data.length, per_page: 50, current_page: 1, last_page: 1 },
    })
  }),

  // GET /api/servicios/:id
  http.get(`${BASE}/servicios/:id`, ({ params }) => {
    const list = storageService.getServicios()
    const item = list.find((s) => s.id === Number(params.id)) ?? list[0]
    return HttpResponse.json({ success: true, message: 'OK', data: item })
  }),

  // GET /api/categorias-servicio
  http.get(`${BASE}/categorias-servicio`, () => {
    const data = storageService.getCategorias()
    return HttpResponse.json({ success: true, message: 'OK', data })
  }),

  // POST /api/servicios
  http.post(`${BASE}/servicios`, async ({ request }) => {
    const body = (await request.json()) as Partial<Servicio>
    const data = storageService.addServicio(body)
    return HttpResponse.json(
      { success: true, message: 'Servicio creado exitosamente', data },
      { status: 201 }
    )
  }),

  // PUT /api/servicios/:id
  http.put(`${BASE}/servicios/:id`, async ({ params, request }) => {
    const id = Number(params.id)
    const body = (await request.json()) as Partial<Servicio>
    const data = storageService.updateServicio(id, body)
    return HttpResponse.json({ success: true, message: 'Servicio actualizado con éxito', data })
  }),

  // DELETE /api/servicios/:id
  http.delete(`${BASE}/servicios/:id`, ({ params }) => {
    const id = Number(params.id)
    storageService.deleteServicio(id)
    return HttpResponse.json({ success: true, message: 'Servicio eliminado correctamente' })
  }),
]
