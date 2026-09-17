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
  modalidad?: 'presencial' | 'virtual'
  enlace_videollamada?: string
  plataforma_videollamada?: 'meet' | 'zoom'
  google_calendar_event_id?: string
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
  serviciosExtraSeleccionados?: ServicioExtra[]
  cuponAplicado?: Cupon
  descuentoCupon?: number
}

// ─── Fase 3: Pagos, Facturas y Cupones ──────────────────────────────────
export type MetodoPago = 'tarjeta' | 'efectivo' | 'transferencia' | 'stripe'
export type EstadoFactura = 'pagada' | 'pendiente' | 'reembolsada'

export interface ItemFactura {
  descripcion: string
  cantidad: number
  precio_unitario: number
  total: number
}

export interface Factura {
  id: number
  numero: string
  cita_id?: number
  cita?: Cita
  cliente_id: number
  cliente?: Cliente
  subtotal: number
  descuento: number
  total: number
  metodo_pago: MetodoPago
  estado: EstadoFactura
  items: ItemFactura[]
  cupon_aplicado?: string
  pdf_url?: string
  created_at: string
}

export type TipoCupon = 'porcentual' | 'fijo'

export interface Cupon {
  id: number
  codigo: string
  tipo: TipoCupon
  valor: number
  valido_desde?: string
  valido_hasta?: string
  usos_max?: number
  usos_actuales: number
  activo: boolean
}

export interface ValidacionCupon {
  valido: boolean
  mensaje: string
  cupon?: Cupon
  descuento_calculado?: number
}

export type EstadoReembolso = 'completado' | 'procesando' | 'rechazado'

export interface Reembolso {
  id: number
  factura_id: number
  factura_numero?: string
  cliente_id?: number
  cliente_nombre?: string
  monto: number
  motivo: string
  estado: EstadoReembolso
  created_at: string
}

// ─── Fase 3: Servicios Extra y Paquetes ──────────────────────────────────
export interface ServicioExtra {
  id: number
  servicio_id?: number
  nombre: string
  descripcion?: string
  precio: number
  duracion_extra_min: number
  activo: boolean
}

export interface PaqueteServicio {
  id: number
  nombre: string
  descripcion: string
  precio_total: number
  precio_original: number
  servicios_ids: number[]
  servicios?: Servicio[]
  descuento_porcentaje: number
  activo: boolean
}

// ─── Fase 3: Lista de Espera ─────────────────────────────────────────────
export type EstadoListaEspera = 'en_espera' | 'notificado' | 'cancelado' | 'convertido'

export interface ItemListaEspera {
  id: number
  cliente_id: number
  cliente?: Cliente
  servicio_id: number
  servicio?: Servicio
  empleado_id?: number
  empleado?: Empleado
  fecha_deseada: string
  hora_preferente?: string
  notas?: string
  estado: EstadoListaEspera
  created_at: string
}

// ─── Fase 4: Integraciones y Notificaciones ──────────────────────────────
export type EstadoIntegracion = 'conectado' | 'desconectado' | 'error'
export type TipoIntegracion = 'google_calendar' | 'google_meet' | 'zoom' | 'whatsapp' | 'webpush'

export interface Integracion {
  id: string
  tipo: TipoIntegracion
  nombre: string
  descripcion: string
  estado: EstadoIntegracion
  icono?: string
  cuenta_vinculada?: string
  sincronizacion_automatica?: boolean
  ultima_sync?: string
}

export type EventoWebhook =
  | 'cita.creada'
  | 'cita.confirmada'
  | 'cita.cancelada'
  | 'cita.pagada'
  | 'cita.reembolsada'
  | 'cliente.creado'

export interface Webhook {
  id: number
  url: string
  eventos: EventoWebhook[]
  secret_key: string
  activo: boolean
  ultimo_envio?: string
  ultimo_status?: number
}

export type TipoNotificacion = 'cita' | 'pago' | 'recordatorio' | 'sistema' | 'espera'

export interface Notificacion {
  id: number
  titulo: string
  mensaje: string
  tipo: TipoNotificacion
  leida: boolean
  fecha: string
  enlace?: string
}

export type CanalNotificacion = 'whatsapp' | 'email' | 'push' | 'sms'

export interface PlantillaMensaje {
  id: number
  canal: CanalNotificacion
  evento: string
  nombre: string
  asunto?: string
  cuerpo: string
  activo: boolean
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

