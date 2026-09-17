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

// ─── Fase 2: Ubicaciones ──────────────────────────────────────────────────
export interface Ubicacion {
  id: number
  nombre: string
  direccion: string
  ciudad: string
  pais: string
  timezone: string
  activo: boolean
}

// ─── Fase 2: Categorías de Servicio ───────────────────────────────────────
export interface CategoriaServicio {
  id: number
  nombre: string
  descripcion?: string
  color?: string
  icono?: string
}

// ─── Fase 2: Servicios ────────────────────────────────────────────────────
export interface DuracionServicio {
  id: number
  servicio_id: number
  duracion_min: number
  precio: number
  etiqueta?: string
}

export interface Servicio {
  id: number
  nombre: string
  descripcion?: string
  categoria_id?: number
  categoria?: CategoriaServicio
  duracion_base_min: number
  precio_base: number
  duraciones?: DuracionServicio[]
  color?: string
  imagen?: string
  activo: boolean
  buffer_antes_min: number
  buffer_despues_min: number
}

// ─── Fase 2: Empleados / Profesionales ────────────────────────────────────
export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6  // 0=Domingo

export interface HorarioEmpleado {
  id: number
  empleado_id: number
  dia_semana: DiaSemana
  hora_inicio: string  // "HH:mm"
  hora_fin: string     // "HH:mm"
  activo: boolean
}

export interface DiaLibre {
  id: number
  empleado_id: number
  fecha: string  // "YYYY-MM-DD"
  motivo?: string
}

export interface Empleado {
  id: number
  usuario_id: number
  nombre: string
  email: string
  bio?: string
  foto?: string
  especialidad?: string
  ubicacion_id?: number
  ubicacion?: Ubicacion
  servicios?: Servicio[]
  horarios?: HorarioEmpleado[]
  dias_libres?: DiaLibre[]
  activo: boolean
}

// ─── Fase 2: Disponibilidad ───────────────────────────────────────────────
export interface SlotDisponible {
  hora_inicio: string  // "HH:mm"
  hora_fin: string
  disponible: boolean
}

export interface DisponibilidadDia {
  fecha: string
  slots: SlotDisponible[]
}

// ─── Fase 2: Clientes ─────────────────────────────────────────────────────
export interface Cliente {
  id: number
  usuario_id?: number
  nombre: string
  email: string
  telefono?: string
  timezone?: string
  notas?: string
  total_citas: number
  created_at: string
}

// ─── Fase 2: Campos personalizados ────────────────────────────────────────
export type TipoCampo = 'text' | 'textarea' | 'checkbox' | 'select' | 'phone' | 'date'

export interface CampoPersonalizado {
  id: number
  servicio_id: number
  etiqueta: string
  tipo: TipoCampo
  requerido: boolean
  opciones?: string[]  // para tipo 'select'
  orden: number
}

export interface RespuestaCampo {
  campo_id: number
  valor: string | boolean
}

// ─── Fase 2: Recurrencia ──────────────────────────────────────────────────
export type TipoRecurrencia = 'diaria' | 'semanal' | 'mensual' | 'anual'

export interface Recurrencia {
  id: number
  tipo: TipoRecurrencia
  intervalo: number   // cada N días/semanas/meses/años
  fecha_fin?: string
}

// ─── Fase 2: Citas ────────────────────────────────────────────────────────
export type EstadoCita = 'pendiente' | 'confirmada' | 'cancelada' | 'completada' | 'no_asistio'

export interface Cita {
  id: number
  cliente_id: number
  cliente?: Cliente
  empleado_id: number
  empleado?: Empleado
  servicio_id: number
  servicio?: Servicio
  duracion_id?: number
  duracion?: DuracionServicio
  ubicacion_id?: number
  ubicacion?: Ubicacion
  fecha_inicio: string  // ISO 8601
  fecha_fin: string
  estado: EstadoCita
  notas?: string
  recurrencia_id?: number
  recurrencia?: Recurrencia
  respuestas_campos?: RespuestaCampo[]
  precio_total: number
  created_at: string
}

// ─── Fase 2: Carrito de reservas ─────────────────────────────────────────
export interface ItemCarrito {
  id: string  // uuid local
  servicio: Servicio
  duracion?: DuracionServicio
  empleado?: Empleado
  fecha_inicio?: string
  fecha_fin?: string
  precio: number
}

// ─── Fase 2: Wizard de nueva cita ────────────────────────────────────────
export type PasoWizard = 1 | 2 | 3 | 4

export interface EstadoWizard {
  paso: PasoWizard
  servicioSeleccionado?: Servicio
  duracionSeleccionada?: DuracionServicio
  empleadoSeleccionado?: Empleado
  fechaSeleccionada?: string
  horaSeleccionada?: string
  notas: string
  respuestasCampos: RespuestaCampo[]
  carrito: ItemCarrito[]
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

export type VistaCalendario = 'mes' | 'semana' | 'dia' | 'lista'
