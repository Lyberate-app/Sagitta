import { http, HttpResponse } from 'msw'
import { User, AuthTokens } from '@/types'

const MOCK_USER: User = {
  id: 1,
  nombre: 'Silvio Admin',
  email: 'admin@sagitta.com',
  rol: 'admin',
  timezone: 'America/New_York',
  created_at: new Date().toISOString(),
}

const MOCK_TOKENS: AuthTokens = {
  access_token: 'mock-jwt-access-token-12345',
  refresh_token: 'mock-jwt-refresh-token-12345',
  expires_in: 3600,
}

const BASE = import.meta.env.VITE_API_BASE_URL as string

export const authHandlers = [
  // POST /auth/login
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    if (body.email && body.password) {
      return HttpResponse.json({
        success: true,
        message: 'Login exitoso',
        data: { user: MOCK_USER, tokens: MOCK_TOKENS },
      })
    }
    return HttpResponse.json(
      { success: false, message: 'Credenciales inválidas' },
      { status: 401 }
    )
  }),

  // GET /auth/me
  http.get(`${BASE}/auth/me`, () => {
    return HttpResponse.json({
      success: true,
      message: 'OK',
      data: MOCK_USER,
    })
  }),

  // POST /auth/logout
  http.post(`${BASE}/auth/logout`, () => {
    return HttpResponse.json({ success: true, message: 'Sesión cerrada' })
  }),
]

