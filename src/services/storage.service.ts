import {
  ConfiguracionMarcaBlanca,
  CategoriaServicio,
  Servicio,
  Empleado,
  Cliente,
  Cita,
  Factura,
  Cupon,
  Reembolso,
  HorarioEmpleado,
} from '@/types'

// ─── KEYS DE LOCALSTORAGE ──────────────────────────────────────────────────
export const STORAGE_KEYS = {
  CONFIGURACION: 'sagitta_marca_blanca_config',
  CATEGORIAS: 'sagitta_categorias',
  SERVICIOS: 'sagitta_servicios',
  EMPLEADOS: 'sagitta_empleados',
  CLIENTES: 'sagitta_clientes',
  CITAS: 'sagitta_citas',
  FACTURAS: 'sagitta_facturas',
  CUPONES: 'sagitta_cupones',
  REEMBOLSOS: 'sagitta_reembolsos',
  PAQUETES: 'sagitta_paquetes',
  LISTA_ESPERA: 'sagitta_lista_espera',
} as const

// ─── SEMILLAS POR DEFECTO (COHERENTES Y MODERNAS) ──────────────────────────

export const CONFIGURACION_DEFAULT: ConfiguracionMarcaBlanca = {
  id: 1,
  nombre_negocio: 'Sagitta Studio',
  lema_negocio: 'Peluquería, Estética & Bienestar Profesional.',
  logo_url: '',
  logo_dark_url: '',
  logo_icono_url: '',
  favicon_url: '',
  color_primario: '#6366f1',
  paleta_predefinida: 'indigo',
  fuente_tipografica: 'Inter',
  radio_esquinas: 'moderno',
  marca_blanca_activa: false,
  ocultar_marca_sistema: false,
  texto_pie_pagina: '© 2026 Sagitta Studio. Todos los derechos reservados.',
  mostrar_powered_by: true,
  texto_powered_by: 'Powered by Sagitta Platform',
  email_soporte: 'hola@sagittastudio.com',
  telefono_soporte: '+1 555-0900',
  sitio_web: 'https://sagitta.pages.dev',
  moneda: 'USD',
  simbolo_moneda: '$',
  zona_horaria: 'America/New_York',
  formato_hora: '12h',
  formato_fecha: 'DD/MM/YYYY',
  url_terminos: '#',
  url_privacidad: '#',
  updated_at: new Date().toISOString(),
}

export const CATEGORIAS_DEFAULT: CategoriaServicio[] = [
  { id: 1, nombre: 'Cortes & Barba', color: '#6366f1', icono: 'scissors', descripcion: 'Estilismo masculino y cortes de tendencia' },
  { id: 2, nombre: 'Facial & Mirada', color: '#ec4899', icono: 'sparkles', descripcion: 'Tratamientos de piel, cejas y pestañas' },
  { id: 3, nombre: 'Masajes & Spa', color: '#10b981', icono: 'heart', descripcion: 'Relajación muscular y cuidado corporal' },
]

export const SERVICIOS_DEFAULT: Servicio[] = [
  {
    id: 1,
    nombre: 'Corte de Cabello & Peinado',
    categoria_id: 1,
    categoria: CATEGORIAS_DEFAULT[0],
    descripcion: 'Lavado relajante, corte a tijera o máquina a tu gusto y peinado final con productos premium.',
    duracion_base_min: 40,
    precio_base: 25,
    color: '#6366f1',
    activo: true,
    buffer_antes_min: 0,
    buffer_despues_min: 5,
    duraciones: [
      { id: 1, servicio_id: 1, duracion_min: 40, precio: 25, etiqueta: 'Estándar' },
      { id: 2, servicio_id: 1, duracion_min: 60, precio: 35, etiqueta: 'Completo VIP' },
    ],
  },
  {
    id: 2,
    nombre: 'Arreglo de Barba & Toalla Caliente',
    categoria_id: 1,
    categoria: CATEGORIAS_DEFAULT[0],
    descripcion: 'Perfilado al detalle, toalla caliente con aceites esenciales e hidratación profunda.',
    duracion_base_min: 25,
    precio_base: 18,
    color: '#6366f1',
    activo: true,
    buffer_antes_min: 0,
    buffer_despues_min: 5,
  },
  {
    id: 3,
    nombre: 'Combo Completo: Corte + Barba',
    categoria_id: 1,
    categoria: CATEGORIAS_DEFAULT[0],
    descripcion: 'Renovación completa: corte personalizado más ritual tradicional de barba y peinado.',
    duracion_base_min: 60,
    precio_base: 38,
    color: '#8b5cf6',
    activo: true,
    buffer_antes_min: 5,
    buffer_despues_min: 10,
  },
  {
    id: 4,
    nombre: 'Limpieza Facial Profunda',
    categoria_id: 2,
    categoria: CATEGORIAS_DEFAULT[1],
    descripcion: 'Exfoliación suave, extracción de impurezas, vapor de ozono y mascarilla hidratante.',
    duracion_base_min: 50,
    precio_base: 45,
    color: '#ec4899',
    activo: true,
    buffer_antes_min: 5,
    buffer_despues_min: 10,
  },
  {
    id: 5,
    nombre: 'Lifting de Pestañas & Cejas',
    categoria_id: 2,
    categoria: CATEGORIAS_DEFAULT[1],
    descripcion: 'Realza tu mirada natural con curvatura perfecta y perfilado armónico de cejas.',
    duracion_base_min: 45,
    precio_base: 35,
    color: '#ec4899',
    activo: true,
    buffer_antes_min: 0,
    buffer_despues_min: 5,
  },
  {
    id: 6,
    nombre: 'Masaje Relajante & Descontracturante',
    categoria_id: 3,
    categoria: CATEGORIAS_DEFAULT[2],
    descripcion: 'Alivia tensiones de cuello y espalda con aceites aromáticos y presión personalizada.',
    duracion_base_min: 60,
    precio_base: 50,
    color: '#10b981',
    activo: true,
    buffer_antes_min: 5,
    buffer_despues_min: 10,
  },
  {
    id: 7,
    nombre: 'Sesión Spa Antiestrés Completa',
    categoria_id: 3,
    categoria: CATEGORIAS_DEFAULT[2],
    descripcion: 'Circuito integral de bienestar corporal, exfoliación suave y masaje holístico.',
    duracion_base_min: 90,
    precio_base: 85,
    color: '#10b981',
    activo: true,
    buffer_antes_min: 10,
    buffer_despues_min: 15,
  },
]

const HORARIOS_ESTANDAR: HorarioEmpleado[] = [
  { id: 1, empleado_id: 1, dia_semana: 1, hora_inicio: '09:00', hora_fin: '19:00', activo: true },
  { id: 2, empleado_id: 1, dia_semana: 2, hora_inicio: '09:00', hora_fin: '19:00', activo: true },
  { id: 3, empleado_id: 1, dia_semana: 3, hora_inicio: '09:00', hora_fin: '19:00', activo: true },
  { id: 4, empleado_id: 1, dia_semana: 4, hora_inicio: '09:00', hora_fin: '19:00', activo: true },
  { id: 5, empleado_id: 1, dia_semana: 5, hora_inicio: '09:00', hora_fin: '19:00', activo: true },
  { id: 6, empleado_id: 1, dia_semana: 6, hora_inicio: '09:00', hora_fin: '15:00', activo: true },
]

export const EMPLEADOS_DEFAULT: Empleado[] = [
  {
    id: 1,
    usuario_id: 2,
    nombre: 'Marco Barbero',
    email: 'marco@sagitta.com',
    especialidad: 'Barbero Master & Estilo Masculino',
    bio: 'Más de 8 años dominando tijera y navaja tradicional. Experto en fades y diseño de barba.',
    activo: true,
    horarios: HORARIOS_ESTANDAR,
  },
  {
    id: 2,
    usuario_id: 3,
    nombre: 'Sofia Estilista',
    email: 'sofia@sagitta.com',
    especialidad: 'Colorimetría & Peinados',
    bio: 'Especialista en mechas, balayage, corte moderno y asesoría visagista personalizada.',
    activo: true,
    horarios: HORARIOS_ESTANDAR.map((h, i) => ({ ...h, id: 10 + i, empleado_id: 2 })),
  },
  {
    id: 3,
    usuario_id: 4,
    nombre: 'Camila Silva',
    email: 'camila@sagitta.com',
    especialidad: 'Facial & Terapeuta Spa',
    bio: 'Certificada internacionalmente en tratamientos dermatológicos suaves, cejas y relajación profunda.',
    activo: true,
    horarios: HORARIOS_ESTANDAR.map((h, i) => ({ ...h, id: 20 + i, empleado_id: 3 })),
  },
]

export const CLIENTES_DEFAULT: Cliente[] = [
  { id: 1, nombre: 'Ana García', email: 'ana@email.com', telefono: '+1 555-0101', total_citas: 8, created_at: '2026-01-10T00:00:00Z' },
  { id: 2, nombre: 'Luis Fernández', email: 'luis@email.com', telefono: '+1 555-0102', total_citas: 3, created_at: '2026-02-15T00:00:00Z' },
  { id: 3, nombre: 'Sofía Torres', email: 'sofia@email.com', telefono: '+1 555-0103', total_citas: 12, created_at: '2025-11-20T00:00:00Z' },
  { id: 4, nombre: 'Miguel Ángel Ruiz', email: 'miguel@email.com', telefono: '+1 555-0104', total_citas: 1, created_at: '2026-09-01T00:00:00Z' },
  { id: 5, nombre: 'Elena Navarro', email: 'elena@email.com', telefono: '+1 555-0105', total_citas: 5, created_at: '2026-03-28T00:00:00Z' },
]

export const CITAS_DEFAULT: Cita[] = [
  {
    id: 1,
    cliente_id: 1,
    cliente: CLIENTES_DEFAULT[0],
    empleado_id: 1,
    empleado: EMPLEADOS_DEFAULT[0],
    servicio_id: 1,
    servicio: SERVICIOS_DEFAULT[0],
    fecha_inicio: new Date().toISOString().replace('T', ' ').slice(0, 16),
    fecha_fin: new Date(Date.now() + 40 * 60000).toISOString().replace('T', ' ').slice(0, 16),
    estado: 'confirmada',
    precio_total: 25,
    notas: 'Cliente habitual, peinado con cera mate',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    cliente_id: 2,
    cliente: CLIENTES_DEFAULT[1],
    empleado_id: 2,
    empleado: EMPLEADOS_DEFAULT[1],
    servicio_id: 4,
    servicio: SERVICIOS_DEFAULT[3],
    fecha_inicio: new Date(Date.now() + 86400000).toISOString().replace('T', ' ').slice(0, 16),
    fecha_fin: new Date(Date.now() + 86400000 + 50 * 60000).toISOString().replace('T', ' ').slice(0, 16),
    estado: 'pendiente',
    precio_total: 45,
    notas: 'Primera sesión facial',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    cliente_id: 3,
    cliente: CLIENTES_DEFAULT[2],
    empleado_id: 3,
    empleado: EMPLEADOS_DEFAULT[2],
    servicio_id: 6,
    servicio: SERVICIOS_DEFAULT[5],
    fecha_inicio: new Date(Date.now() - 86400000).toISOString().replace('T', ' ').slice(0, 16),
    fecha_fin: new Date(Date.now() - 86400000 + 60 * 60000).toISOString().replace('T', ' ').slice(0, 16),
    estado: 'completada',
    precio_total: 50,
    notas: 'Sesión de relajación completada',
    created_at: new Date().toISOString(),
  },
]

export const CUPONES_DEFAULT: Cupon[] = [
  { id: 1, codigo: 'BIENVENIDO15', tipo: 'porcentual', valor: 15, usos_max: 100, usos_actuales: 12, activo: true },
  { id: 2, codigo: 'VIP10', tipo: 'fijo', valor: 10, usos_max: 50, usos_actuales: 8, activo: true },
]

export const FACTURAS_DEFAULT: Factura[] = [
  {
    id: 1,
    numero: 'FAC-2026-001',
    cita_id: 1,
    cliente_id: 1,
    cliente: CLIENTES_DEFAULT[0],
    subtotal: 25,
    descuento: 0,
    total: 25,
    metodo_pago: 'tarjeta',
    estado: 'pagada',
    items: [{ descripcion: 'Corte de Cabello & Peinado (40 min)', cantidad: 1, precio_unitario: 25, total: 25 }],
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    numero: 'FAC-2026-002',
    cita_id: 3,
    cliente_id: 3,
    cliente: CLIENTES_DEFAULT[2],
    subtotal: 50,
    descuento: 0,
    total: 50,
    metodo_pago: 'efectivo',
    estado: 'pagada',
    items: [{ descripcion: 'Masaje Relajante (60 min)', cantidad: 1, precio_unitario: 50, total: 50 }],
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

// ─── FUNCIONES SEGURAS DE LECTURA Y ESCRITURA ──────────────────────────────

function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return defaultValue
    const raw = window.localStorage.getItem(key)
    if (!raw) {
      window.localStorage.setItem(key, JSON.stringify(defaultValue))
      return defaultValue
    }
    const parsed = JSON.parse(raw) as T
    return parsed
  } catch (err) {
    console.warn(`Error al leer ${key} de localStorage:`, err)
    return defaultValue
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  } catch (err) {
    console.error(`Error al escribir ${key} en localStorage:`, err)
  }
}

// ─── EXPORTACIONES DEL SERVICIO DE ALMACENAMIENTO ──────────────────────────

export const storageService = {
  // Configuración
  getConfiguracion: (): ConfiguracionMarcaBlanca => safeGetItem(STORAGE_KEYS.CONFIGURACION, CONFIGURACION_DEFAULT),
  saveConfiguracion: (data: Partial<ConfiguracionMarcaBlanca>): ConfiguracionMarcaBlanca => {
    const actual = safeGetItem(STORAGE_KEYS.CONFIGURACION, CONFIGURACION_DEFAULT)
    const nueva: ConfiguracionMarcaBlanca = { ...actual, ...data, updated_at: new Date().toISOString() }
    safeSetItem(STORAGE_KEYS.CONFIGURACION, nueva)
    return nueva
  },
  resetConfiguracion: (): ConfiguracionMarcaBlanca => {
    safeSetItem(STORAGE_KEYS.CONFIGURACION, CONFIGURACION_DEFAULT)
    return CONFIGURACION_DEFAULT
  },

  // Categorías
  getCategorias: (): CategoriaServicio[] => safeGetItem(STORAGE_KEYS.CATEGORIAS, CATEGORIAS_DEFAULT),
  saveCategorias: (cats: CategoriaServicio[]): void => safeSetItem(STORAGE_KEYS.CATEGORIAS, cats),

  // Servicios
  getServicios: (): Servicio[] => safeGetItem(STORAGE_KEYS.SERVICIOS, SERVICIOS_DEFAULT),
  saveServicios: (servicios: Servicio[]): void => safeSetItem(STORAGE_KEYS.SERVICIOS, servicios),
  addServicio: (servicio: Partial<Servicio>): Servicio => {
    const list = safeGetItem(STORAGE_KEYS.SERVICIOS, SERVICIOS_DEFAULT)
    const categorias = safeGetItem(STORAGE_KEYS.CATEGORIAS, CATEGORIAS_DEFAULT)
    const cat = categorias.find((c) => c.id === servicio.categoria_id) || categorias[0]
    const nuevo: Servicio = {
      id: Date.now(),
      nombre: servicio.nombre ?? 'Nuevo Servicio',
      descripcion: servicio.descripcion ?? '',
      categoria_id: cat.id,
      categoria: cat,
      duracion_base_min: Number(servicio.duracion_base_min) || 30,
      precio_base: Number(servicio.precio_base) || 20,
      color: servicio.color || cat.color || '#6366f1',
      activo: servicio.activo ?? true,
      buffer_antes_min: Number(servicio.buffer_antes_min) || 0,
      buffer_despues_min: Number(servicio.buffer_despues_min) || 5,
      ...servicio,
    }
    list.push(nuevo)
    safeSetItem(STORAGE_KEYS.SERVICIOS, list)
    return nuevo
  },
  updateServicio: (id: number, data: Partial<Servicio>): Servicio => {
    const list = safeGetItem(STORAGE_KEYS.SERVICIOS, SERVICIOS_DEFAULT)
    const idx = list.findIndex((s) => s.id === id)
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data }
      safeSetItem(STORAGE_KEYS.SERVICIOS, list)
      return list[idx]
    }
    return { ...SERVICIOS_DEFAULT[0], id, ...data }
  },
  deleteServicio: (id: number): void => {
    const list = safeGetItem(STORAGE_KEYS.SERVICIOS, SERVICIOS_DEFAULT)
    const filtered = list.filter((s) => s.id !== id)
    safeSetItem(STORAGE_KEYS.SERVICIOS, filtered)
  },

  // Empleados
  getEmpleados: (): Empleado[] => safeGetItem(STORAGE_KEYS.EMPLEADOS, EMPLEADOS_DEFAULT),
  saveEmpleados: (emps: Empleado[]): void => safeSetItem(STORAGE_KEYS.EMPLEADOS, emps),
  addEmpleado: (emp: Partial<Empleado>): Empleado => {
    const list = safeGetItem(STORAGE_KEYS.EMPLEADOS, EMPLEADOS_DEFAULT)
    const nuevo: Empleado = {
      id: Date.now(),
      usuario_id: Date.now(),
      nombre: emp.nombre ?? 'Nuevo Especialista',
      email: emp.email ?? `empleado${Date.now()}@sagitta.com`,
      especialidad: emp.especialidad ?? 'Especialista',
      bio: emp.bio ?? '',
      activo: emp.activo ?? true,
      horarios: emp.horarios ?? HORARIOS_ESTANDAR.map((h, i) => ({ ...h, id: Date.now() + i })),
      ...emp,
    }
    list.push(nuevo)
    safeSetItem(STORAGE_KEYS.EMPLEADOS, list)
    return nuevo
  },
  updateEmpleado: (id: number, data: Partial<Empleado>): Empleado => {
    const list = safeGetItem(STORAGE_KEYS.EMPLEADOS, EMPLEADOS_DEFAULT)
    const idx = list.findIndex((e) => e.id === id)
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data }
      safeSetItem(STORAGE_KEYS.EMPLEADOS, list)
      return list[idx]
    }
    return { ...EMPLEADOS_DEFAULT[0], id, ...data }
  },
  deleteEmpleado: (id: number): void => {
    const list = safeGetItem(STORAGE_KEYS.EMPLEADOS, EMPLEADOS_DEFAULT)
    const filtered = list.filter((e) => e.id !== id)
    safeSetItem(STORAGE_KEYS.EMPLEADOS, filtered)
  },

  // Clientes
  getClientes: (): Cliente[] => safeGetItem(STORAGE_KEYS.CLIENTES, CLIENTES_DEFAULT),
  addCliente: (cli: Partial<Cliente>): Cliente => {
    const list = safeGetItem(STORAGE_KEYS.CLIENTES, CLIENTES_DEFAULT)
    const existing = list.find(
      (c) =>
        (cli.email && c.email?.toLowerCase() === cli.email.toLowerCase()) ||
        (cli.telefono && c.telefono === cli.telefono)
    )
    if (existing) {
      existing.total_citas = (existing.total_citas || 0) + 1
      safeSetItem(STORAGE_KEYS.CLIENTES, list)
      return existing
    }
    const nuevo: Cliente = {
      id: Date.now(),
      nombre: cli.nombre ?? 'Cliente',
      email: cli.email ?? `cliente_${Date.now()}@sagitta.app`,
      telefono: cli.telefono ?? '',
      total_citas: 1,
      created_at: new Date().toISOString(),
      ...cli,
    }
    list.unshift(nuevo)
    safeSetItem(STORAGE_KEYS.CLIENTES, list)
    return nuevo
  },

  // Citas
  getCitas: (): Cita[] => safeGetItem(STORAGE_KEYS.CITAS, CITAS_DEFAULT),
  addCita: (cita: Partial<Cita>): Cita => {
    const list = safeGetItem(STORAGE_KEYS.CITAS, CITAS_DEFAULT)
    const servicios = safeGetItem(STORAGE_KEYS.SERVICIOS, SERVICIOS_DEFAULT)
    const empleados = safeGetItem(STORAGE_KEYS.EMPLEADOS, EMPLEADOS_DEFAULT)
    const clientes = safeGetItem(STORAGE_KEYS.CLIENTES, CLIENTES_DEFAULT)

    const serv = servicios.find((s) => s.id === cita.servicio_id) || cita.servicio || servicios[0]
    const emp = empleados.find((e) => e.id === cita.empleado_id) || cita.empleado || empleados[0]
    const cli = clientes.find((c) => c.id === cita.cliente_id) || cita.cliente || clientes[0]

    const nueva: Cita = {
      id: Date.now(),
      cliente_id: cli?.id || 1,
      cliente: cli,
      empleado_id: emp?.id || 1,
      empleado: emp,
      servicio_id: serv?.id || 1,
      servicio: serv,
      fecha_inicio: cita.fecha_inicio ?? new Date().toISOString(),
      fecha_fin: cita.fecha_fin ?? new Date(Date.now() + 30 * 60000).toISOString(),
      estado: cita.estado ?? 'confirmada',
      precio_total: cita.precio_total ?? serv?.precio_base ?? 25,
      notas: cita.notas ?? '',
      created_at: new Date().toISOString(),
      ...cita,
    }
    list.unshift(nueva)
    safeSetItem(STORAGE_KEYS.CITAS, list)
    return nueva
  },
  updateCita: (id: number, data: Partial<Cita>): Cita => {
    const list = safeGetItem(STORAGE_KEYS.CITAS, CITAS_DEFAULT)
    const idx = list.findIndex((c) => c.id === id)
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data }
      safeSetItem(STORAGE_KEYS.CITAS, list)
      return list[idx]
    }
    return { ...CITAS_DEFAULT[0], id, ...data }
  },
  cancelCita: (id: number): void => {
    const list = safeGetItem(STORAGE_KEYS.CITAS, CITAS_DEFAULT)
    const idx = list.findIndex((c) => c.id === id)
    if (idx !== -1) {
      list[idx].estado = 'cancelada'
      safeSetItem(STORAGE_KEYS.CITAS, list)
    }
  },

  // Facturas
  getFacturas: (): Factura[] => safeGetItem(STORAGE_KEYS.FACTURAS, FACTURAS_DEFAULT),
  addFactura: (fac: Partial<Factura>): Factura => {
    const list = safeGetItem(STORAGE_KEYS.FACTURAS, FACTURAS_DEFAULT)
    const nueva: Factura = {
      ...FACTURAS_DEFAULT[0],
      id: Date.now(),
      numero: `FAC-2026-${String(list.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
      ...fac,
    }
    list.unshift(nueva)
    safeSetItem(STORAGE_KEYS.FACTURAS, list)
    return nueva
  },

  // Cupones
  getCupones: (): Cupon[] => safeGetItem(STORAGE_KEYS.CUPONES, CUPONES_DEFAULT),
  addCupon: (cup: Partial<Cupon>): Cupon => {
    const list = safeGetItem(STORAGE_KEYS.CUPONES, CUPONES_DEFAULT)
    const nuevo: Cupon = {
      id: Date.now(),
      codigo: (cup.codigo ?? 'PROMO').toUpperCase().trim(),
      tipo: cup.tipo ?? 'porcentual',
      valor: Number(cup.valor) || 10,
      usos_max: Number(cup.usos_max) || 50,
      usos_actuales: 0,
      activo: true,
      ...cup,
    }
    list.push(nuevo)
    safeSetItem(STORAGE_KEYS.CUPONES, list)
    return nuevo
  },
  deleteCupon: (id: number): void => {
    const list = safeGetItem(STORAGE_KEYS.CUPONES, CUPONES_DEFAULT)
    const filtered = list.filter((c) => c.id !== id)
    safeSetItem(STORAGE_KEYS.CUPONES, filtered)
  },

  // Reembolsos
  getReembolsos: (): Reembolso[] => safeGetItem<Reembolso[]>(STORAGE_KEYS.REEMBOLSOS, []),
  addReembolso: (reem: Partial<Reembolso>): Reembolso => {
    const list = safeGetItem<Reembolso[]>(STORAGE_KEYS.REEMBOLSOS, [])
    const nuevo: Reembolso = {
      id: Date.now(),
      factura_id: reem.factura_id || 1,
      factura_numero: reem.factura_numero || 'FAC-2026-001',
      cliente_nombre: reem.cliente_nombre || 'Cliente',
      monto: reem.monto || 0,
      motivo: reem.motivo || 'Cancelación',
      estado: 'completado',
      created_at: new Date().toISOString(),
      ...reem,
    }
    list.unshift(nuevo)
    safeSetItem(STORAGE_KEYS.REEMBOLSOS, list)
    return nuevo
  },
}
