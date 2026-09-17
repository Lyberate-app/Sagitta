import { http, HttpResponse } from 'msw'
import { Cliente } from '@/types'
import { storageService } from '@/services/storage.service'
import { BASE } from '../base'

export const clientesHandlers = [
  // GET /api/clientes
  http.get(`${BASE}/clientes`, ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.toLowerCase()
    const all = storageService.getClientes()
    const data = q
      ? all.filter(
          (c) =>
            c.nombre.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            (c.telefono && c.telefono.includes(q))
        )
      : all
    return HttpResponse.json({
      success: true,
      message: 'OK',
      data,
      meta: { total: data.length, per_page: 50, current_page: 1, last_page: 1 },
    })
  }),

  // GET /api/clientes/:id
  http.get(`${BASE}/clientes/:id`, ({ params }) => {
    const list = storageService.getClientes()
    const item = list.find((c) => c.id === Number(params.id)) ?? list[0]
    return HttpResponse.json({ success: true, message: 'OK', data: item })
  }),

  // POST /api/clientes
  http.post(`${BASE}/clientes`, async ({ request }) => {
    const body = (await request.json()) as Partial<Cliente>
    const nuevo = storageService.addCliente(body)
    return HttpResponse.json(
      { success: true, message: 'Cliente registrado exitosamente', data: nuevo },
      { status: 201 }
    )
  }),
]
