// ─── Usuarios y Auth ───────────────────────────────────────────────────────
export type UserRole = 'admin' | 'gerente' | 'empleado' | 'cliente'

export interface User {
  id: number
  nombre: string
  email: string
  rol: UserRole
  avatar?: string
  timezone: string
  created_at: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface LoginPayload {
  email: string
  password: string
}

// ─── Respuesta genérica de la API ─────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  message: string
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

// ─── Servicios / Citas (stub para Fase 2) ──────────────────────────────────
export type EstadoCita = 'pendiente' | 'confirmada' | 'cancelada' | 'completada'

export interface Cita {
  id: number
  cliente_id: number
  profesional_id: number
  servicio_id: number
  ubicacion_id?: number
  fecha_inicio: string
  fecha_fin: string
  estado: EstadoCita
  notas?: string
  created_at: string
}

export interface Servicio {
  id: number
  nombre: string
  descripcion?: string
  duracion_min: number
  precio: number
  categoria_id?: number
}

export interface Profesional {
  id: number
  usuario_id: number
  nombre: string
  bio?: string
  foto?: string
  ubicacion_id?: number
}

// ─── UI ────────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

export type Theme = 'light' | 'dark' | 'system'

