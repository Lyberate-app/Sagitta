import { http, HttpResponse } from 'msw'
import { ConfiguracionMarcaBlanca } from '@/types'
import { storageService, CONFIGURACION_DEFAULT } from '@/services/storage.service'
import { BASE } from '../base'

export { CONFIGURACION_DEFAULT }

export const configuracionHandlers = [
  // GET /api/configuracion
  http.get(`${BASE}/configuracion`, () => {
    const data = storageService.getConfiguracion()
    return HttpResponse.json({
      success: true,
      data,
      message: 'Configuración recuperada con éxito',
    })
  }),

  // PUT /api/configuracion
  http.put(`${BASE}/configuracion`, async ({ request }) => {
    const body = (await request.json()) as Partial<ConfiguracionMarcaBlanca>
    const data = storageService.saveConfiguracion(body)
    return HttpResponse.json({
      success: true,
      data,
      message: 'Configuración de marca blanca actualizada',
    })
  }),

  // POST /api/configuracion/reset
  http.post(`${BASE}/configuracion/reset`, () => {
    const data = storageService.resetConfiguracion()
    return HttpResponse.json({
      success: true,
      data,
      message: 'Configuración restaurada a valores por defecto',
    })
  }),
]
