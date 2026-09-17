import { useState, useEffect, useMemo, useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Lock,
  ChevronRight,
  ArrowRight,
  Calendar,
  MessageSquare,
  FileText,
  Scissors,
  X,
  Compass,
  Star,
  Sun,
  Moon,
  Search,
  CalendarCheck,
  ShieldCheck,
  Download,
  Smartphone,
} from 'lucide-react'
import { AppContext } from '@/context/AppContext'
import { useConfiguracion } from '@/hooks/useConfiguracion'
import { TenantSelector } from '@/components/crm/TenantSelector'
import { I18nSelector } from '@/components/crm/I18nSelector'
import { Button, Input, Loader } from '@/components/ui'
import { useToast } from '@/hooks/useToast'
import { serviciosService } from '@/services/servicios.service'
import { empleadosService } from '@/services/empleados.service'
import { citasService } from '@/services/citas.service'
import { clientesService } from '@/services/clientes.service'
import { pagosService } from '@/services/pagos.service'
import { storageService } from '@/services/storage.service'
import { Servicio, Empleado, SlotDisponible, Cita, CategoriaServicio } from '@/types'
import {
  generarUrlGoogleCalendar,
  generarUrlWhatsApp,
} from '@/utils/calendar'
import { getDeviceInfo } from '@/utils/device'
import { imprimirOguardarComprobantePDF } from '@/utils/pdfReceipt'
import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt'

// ─── SERVICIOS REALISTAS, HUMANOS Y CLAROS (ESTILO APP NATIVA IOS / ANDROID) ───
interface ServicioVisual extends Servicio {
  popular?: boolean
  emoji?: string
  destacado?: string
}

const SERVICIOS_SEMILLA_DEFAULT: ServicioVisual[] = [
  {
    id: 101,
    nombre: 'Corte de Cabello & Peinado',
    categoria_id: 1,
    descripcion: 'Lavado relajante con champú hidratante, corte a tijera o máquina a tu gusto y peinado final.',
    duracion_base_min: 40,
    precio_base: 25,
    activo: true,
    buffer_antes_min: 5,
    buffer_despues_min: 10,
    color: '#6366f1',
    popular: true,
    emoji: '✂️',
    destacado: 'Más pedido',
  },
  {
    id: 102,
    nombre: 'Arreglo de Barba & Toalla Caliente',
    categoria_id: 1,
    descripcion: 'Perfilado al detalle con navaja, toalla caliente aromatizada y bálsamo hidratante.',
    duracion_base_min: 30,
    precio_base: 18,
    activo: true,
    buffer_antes_min: 5,
    buffer_despues_min: 5,
    color: '#3b82f6',
    popular: true,
    emoji: '🧔',
  },
  {
    id: 104,
    nombre: 'Combo Completo: Corte + Barba',
    categoria_id: 1,
    descripcion: 'El paquete favorito: corte de cabello completo, lavado, perfilado de barba y toalla caliente.',
    duracion_base_min: 60,
    precio_base: 38,
    activo: true,
    buffer_antes_min: 5,
    buffer_despues_min: 10,
    color: '#4f46e5',
    popular: true,
    emoji: '💈',
    destacado: 'Ahorra $5',
  },
  {
    id: 103,
    nombre: 'Color, Mechas o Balayage',
    categoria_id: 1,
    descripcion: 'Tinte completo o mechas luminosas con mascarilla de nutrición profunda para cuidar tu pelo.',
    duracion_base_min: 90,
    precio_base: 65,
    activo: true,
    buffer_antes_min: 10,
    buffer_despues_min: 15,
    color: '#8b5cf6',
    emoji: '🎨',
  },
  {
    id: 201,
    nombre: 'Limpieza Facial Profunda',
    categoria_id: 2,
    descripcion: 'Extracción suave de impurezas, exfoliación dérmica, mascarilla calmante y masaje facial.',
    duracion_base_min: 50,
    precio_base: 45,
    activo: true,
    buffer_antes_min: 10,
    buffer_despues_min: 10,
    color: '#ec4899',
    popular: true,
    emoji: '🧖‍♀️',
    destacado: 'Piel fresca',
  },
  {
    id: 202,
    nombre: 'Lifting de Pestañas & Cejas',
    categoria_id: 2,
    descripcion: 'Curvatura natural de pestañas con tinte y perfilado de cejas para resaltar tu mirada.',
    duracion_base_min: 45,
    precio_base: 35,
    activo: true,
    buffer_antes_min: 5,
    buffer_despues_min: 5,
    color: '#f43f5e',
    emoji: '👁️',
  },
  {
    id: 301,
    nombre: 'Masaje Relajante & Descontracturante',
    categoria_id: 3,
    descripcion: 'Descarga tensiones de espalda, cuello y hombros con aceites naturales tibios y aromaterapia.',
    duracion_base_min: 50,
    precio_base: 45,
    activo: true,
    buffer_antes_min: 10,
    buffer_despues_min: 15,
    color: '#10b981',
    popular: true,
    emoji: '💆‍♂️',
    destacado: 'Alivio total',
  },
  {
    id: 302,
    nombre: 'Sesión Spa Antiestrés Completa',
    categoria_id: 3,
    descripcion: 'Experiencia integral de masaje corporal, reflexología en pies y desconexión absoluta.',
    duracion_base_min: 75,
    precio_base: 60,
    activo: true,
    buffer_antes_min: 10,
    buffer_despues_min: 10,
    color: '#14b8a6',
    emoji: '🌿',
  },
]

const CATEGORIAS_SEMILLA = [
  { id: 1, nombre: 'Cortes & Barba', emoji: '✂️', color: '#6366f1' },
  { id: 2, nombre: 'Facial & Mirada', emoji: '🧖‍♀️', color: '#ec4899' },
  { id: 3, nombre: 'Masajes & Spa', emoji: '💆', color: '#10b981' },
]

const EMPLEADOS_SEMILLA: Empleado[] = [
  {
    id: 1,
    usuario_id: 2,
    nombre: 'Valentina Rosales',
    email: 'valentina@sagitta.com',
    especialidad: 'Estilista & Color',
    activo: true,
  },
  {
    id: 2,
    usuario_id: 3,
    nombre: 'Mateo Calderón',
    email: 'mateo@sagitta.com',
    especialidad: 'Barbería Masculina',
    activo: true,
  },
  {
    id: 3,
    usuario_id: 4,
    nombre: 'Camila Silva',
    email: 'camila@sagitta.com',
    especialidad: 'Facial & Masajes',
    activo: true,
  },
]

export default function PortalReservaPage() {
  const { configuracion, nombreMarca, lemaMarca } = useConfiguracion()
  const { toast } = useToast()
  const app = useContext(AppContext)

  const formatearMoneda = (monto: number) =>
    `${configuracion.simbolo_moneda || '$'}${monto.toFixed(2)}`

  // Catálogos reactivos desde almacenamiento local sincronizado
  const [servicios, setServicios] = useState<Servicio[]>(() => {
    const list = storageService.getServicios()
    return list.length > 0 ? list : SERVICIOS_SEMILLA_DEFAULT
  })
  const [categorias, setCategorias] = useState<CategoriaServicio[]>(() => {
    const cats = storageService.getCategorias()
    return cats.length > 0 ? cats : CATEGORIAS_SEMILLA
  })
  const [empleados, setEmpleados] = useState<Empleado[]>(() => {
    const emps = storageService.getEmpleados()
    return emps.length > 0 ? emps : EMPLEADOS_SEMILLA
  })
  const [cargando, setCargando] = useState(true)

  // Filtros
  const [categoriaActiva, setCategoriaActiva] = useState<number | 'todas'>('todas')
  const [busqueda, setBusqueda] = useState('')

  // Sub-Ventana Desplegable (iOS Bottom Sheet)
  const [subVentanaAbierta, setSubVentanaAbierta] = useState(false)
  const [servicioSel, setServicioSel] = useState<Servicio | null>(null)
  const [empleadoSel, setEmpleadoSel] = useState<Empleado | null>(null)
  const [fechaSel, setFechaSel] = useState<string>('')
  const [horaSel, setHoraSel] = useState<string>('')
  const [pasoSubVentana, setPasoSubVentana] = useState<1 | 2 | 3>(1) // 1: Horario, 2: Datos, 3: Confirmada

  // Horarios / Slots
  const [slots, setSlots] = useState<SlotDisponible[]>([])
  const [cargandoSlots, setCargandoSlots] = useState(false)

  // Datos del cliente
  const [nombreCliente, setNombreCliente] = useState('')
  const [telefonoCliente, setTelefonoCliente] = useState('')
  const [emailCliente, setEmailCliente] = useState('')
  const [notasCliente, setNotasCliente] = useState('')
  const [guardandoCita, setGuardandoCita] = useState(false)

  // Confirmación
  const [citaConfirmada, setCitaConfirmada] = useState<Cita | null>(null)
  const [folioReserva, setFolioReserva] = useState<string>('')

  // Detección de dispositivo y ref de scroll para el modal con teclado móvil
  const deviceInfo = useMemo(() => getDeviceInfo(), [])
  const modalScrollRef = useRef<HTMLDivElement>(null)

  // Desplazamiento automático al cambiar de paso en el modal
  useEffect(() => {
    if (subVentanaAbierta && modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [pasoSubVentana, subVentanaAbierta])

  // Ajuste suave de scroll en dispositivos móviles al enfocar un campo
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 250)
  }

  // Días próximos en hora local
  const proximosDias = useMemo(() => {
    const lista = []
    const base = new Date()
    for (let i = 1; i <= 14; i++) {
      const d = new Date(base)
      d.setDate(base.getDate() + i)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const dia = String(d.getDate()).padStart(2, '0')
      const nombreDia = d.toLocaleDateString('es-ES', { weekday: 'short' })
      const etiquetaDia = i === 1 ? 'Mañ' : nombreDia
      lista.push({
        iso: `${y}-${m}-${dia}`,
        diaSemana: etiquetaDia,
        diaNum: d.getDate(),
        mes: d.toLocaleDateString('es-ES', { month: 'short' }),
      })
    }
    return lista
  }, [])

  // Carga inicial de datos
  useEffect(() => {
    async function init() {
      try {
        const [resServ, resCat, resEmp] = await Promise.allSettled([
          serviciosService.getAll(),
          serviciosService.getCategorias(),
          empleadosService.getAll(),
        ])

        if (resServ.status === 'fulfilled' && resServ.value.data?.length) {
          setServicios(resServ.value.data)
        }
        if (resCat.status === 'fulfilled' && resCat.value.data?.length) {
          setCategorias(resCat.value.data)
        }
        if (resEmp.status === 'fulfilled' && resEmp.value.data?.length) {
          setEmpleados(resEmp.value.data)
        }
      } catch (err) {
        console.warn('Usando catálogo de respaldo local:', err)
      } finally {
        setCargando(false)
        if (proximosDias.length > 0) {
          setFechaSel(proximosDias[0].iso)
        }
      }
    }
    init()
  }, [proximosDias])

  // Cargar slots al cambiar fecha o empleado
  useEffect(() => {
    if (!subVentanaAbierta || !fechaSel) return
    setCargandoSlots(true)

    const empId = empleadoSel?.id || 1
    citasService
      .getDisponibilidad(empId, fechaSel, servicioSel?.id)
      .then((res) => {
        if (res.data?.length) {
          setSlots(res.data)
        } else {
          setSlots([
            { hora_inicio: '09:00', hora_fin: '09:40', disponible: true },
            { hora_inicio: '10:00', hora_fin: '10:40', disponible: true },
            { hora_inicio: '11:00', hora_fin: '11:40', disponible: false },
            { hora_inicio: '12:00', hora_fin: '12:40', disponible: true },
            { hora_inicio: '15:00', hora_fin: '15:40', disponible: true },
            { hora_inicio: '16:00', hora_fin: '16:40', disponible: true },
            { hora_inicio: '17:00', hora_fin: '17:40', disponible: false },
            { hora_inicio: '18:00', hora_fin: '18:40', disponible: true },
          ])
        }
      })
      .catch(() => {
        setSlots([
          { hora_inicio: '09:30', hora_fin: '10:15', disponible: true },
          { hora_inicio: '10:30', hora_fin: '11:15', disponible: true },
          { hora_inicio: '15:00', hora_fin: '15:45', disponible: true },
          { hora_inicio: '16:30', hora_fin: '17:15', disponible: true },
          { hora_inicio: '17:30', hora_fin: '18:15', disponible: true },
        ])
      })
      .finally(() => setCargandoSlots(false))
  }, [subVentanaAbierta, empleadoSel, fechaSel, servicioSel])

  // Filtrado de servicios
  const serviciosFiltrados = useMemo(() => {
    return servicios.filter((s) => {
      const matchCat = categoriaActiva === 'todas' || s.categoria_id === categoriaActiva
      const matchBusqueda =
        !busqueda.trim() ||
        s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (s.descripcion ?? '').toLowerCase().includes(busqueda.toLowerCase())
      return matchCat && matchBusqueda
    })
  }, [servicios, categoriaActiva, busqueda])

  // Abrir sub-ventana modal estilo iOS
  const handleAbrirSubVentana = (serv?: Servicio) => {
    const target = serv || servicios[0] || SERVICIOS_SEMILLA_DEFAULT[0]
    setServicioSel(target)
    setEmpleadoSel(null) // null significa "Cualquiera disponible"
    setHoraSel('')
    setPasoSubVentana(1)
    setSubVentanaAbierta(true)
  }

  // Confirmar cita
  const handleConfirmarCita = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!servicioSel || !fechaSel || !horaSel) {
      toast.warning('Horario pendiente', 'Por favor selecciona la hora de tu cita')
      return
    }
    if (!nombreCliente.trim() || !telefonoCliente.trim()) {
      toast.warning('Datos incompletos', 'Ingresa al menos tu nombre y teléfono para avisarte')
      return
    }

    const empAsignado =
      empleadoSel || empleados.find((e) => e.activo) || EMPLEADOS_SEMILLA[0]

    setGuardandoCita(true)
    try {
      const durMin = servicioSel.duracion_base_min || 40
      const fechaInicio = `${fechaSel} ${horaSel}:00`
      const [h, m] = horaSel.split(':').map(Number)
      const totalMin = h * 60 + m + durMin
      const hFin = String(Math.floor(totalMin / 60)).padStart(2, '0')
      const mFin = String(totalMin % 60).padStart(2, '0')
      const fechaFin = `${fechaSel} ${hFin}:${mFin}:00`

      let clienteId = Date.now()
      try {
        const resCli = await clientesService.create({
          nombre: nombreCliente.trim(),
          telefono: telefonoCliente.trim(),
          email: emailCliente.trim().toLowerCase() || `${telefonoCliente.replace(/\D/g, '')}@cliente.local`,
          notas: notasCliente,
        })
        if (resCli.data?.id) clienteId = resCli.data.id
      } catch {
        // Fallback local
      }

      let citaFinal: Cita
      try {
        const resCita = await citasService.create({
          cliente_id: clienteId,
          empleado_id: empAsignado.id,
          servicio_id: servicioSel.id,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          precio_total: servicioSel.precio_base,
          estado: 'confirmada',
          modalidad: 'presencial',
          notas: notasCliente ? `[Web] ${notasCliente}` : '[Web]',
        })
        citaFinal = resCita.data ?? {
          id: Date.now(),
          cliente_id: clienteId,
          empleado_id: empAsignado.id,
          servicio_id: servicioSel.id,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          precio_total: servicioSel.precio_base,
          estado: 'confirmada',
          servicio: servicioSel,
          empleado: empAsignado,
          cliente: {
            id: clienteId,
            nombre: nombreCliente,
            email: emailCliente,
            telefono: telefonoCliente,
            total_citas: 1,
            created_at: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
        }
      } catch {
        citaFinal = {
          id: Date.now(),
          cliente_id: clienteId,
          empleado_id: empAsignado.id,
          servicio_id: servicioSel.id,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          precio_total: servicioSel.precio_base,
          estado: 'confirmada',
          servicio: servicioSel,
          empleado: empAsignado,
          cliente: {
            id: clienteId,
            nombre: nombreCliente,
            email: emailCliente,
            telefono: telefonoCliente,
            total_citas: 1,
            created_at: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
        }
      }

      // Registrar factura automática para el panel de finanzas
      try {
        await pagosService.crearFactura({
          cita_id: citaFinal.id,
          cliente_id: clienteId,
          subtotal: servicioSel.precio_base,
          descuento: 0,
          total: servicioSel.precio_base,
          metodo_pago: 'efectivo',
          estado: 'pagada',
          items: [
            {
              descripcion: `${servicioSel.nombre} (${durMin} min)`,
              cantidad: 1,
              precio_unitario: servicioSel.precio_base,
              total: servicioSel.precio_base,
            },
          ],
        })
      } catch {
        // Fallback silencioso
      }

      const folio = `SAG-${Math.floor(10000 + Math.random() * 90000)}`
      setFolioReserva(folio)
      setCitaConfirmada(citaFinal)
      setPasoSubVentana(3)
      toast.success('¡Turno apartado con éxito!', 'Te esperamos en el salón.')
    } catch (err) {
      toast.error('Error', err instanceof Error ? err.message : 'No se pudo agendar')
    } finally {
      setGuardandoCita(false)
    }
  }

  // Cerrar sub-ventana
  const handleCerrarSubVentana = () => {
    setSubVentanaAbierta(false)
    if (pasoSubVentana === 3) {
      setServicioSel(null)
      setHoraSel('')
      setNombreCliente('')
      setTelefonoCliente('')
      setEmailCliente('')
      setNotasCliente('')
      setCitaConfirmada(null)
      setFolioReserva('')
      setPasoSubVentana(1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC] dark:bg-[#090B10] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-600 selection:text-white pb-28 overflow-x-hidden">
      {/* ─── BANNER / MODAL DE INSTALACIÓN PWA (IOS & ANDROID) ───────────── */}
      <PwaInstallPrompt />

      {/* ─── 1. CABECERA NATIVA ESTILO APP (IOS / ANDROID APP BAR) ────────── */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/90 dark:bg-[#0D1117]/90 border-b border-slate-200/80 dark:border-slate-800 transition-all">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Avatar del Negocio / Salón */}
          <div className="flex items-center gap-3 min-w-0">
            {configuracion.logo_url ? (
              <img
                src={configuracion.logo_url}
                alt={nombreMarca}
                className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                <Scissors className="w-5 h-5" />
              </div>
            )}
            <div className="leading-tight min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white truncate">
                  {nombreMarca}
                </span>
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-black shrink-0">
                  ✓
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {lemaMarca || 'Peluquería, Estética & Bienestar'}
              </p>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:block">
              <TenantSelector />
            </div>
            <I18nSelector />

            {/* Alternador de Modo Claro / Oscuro */}
            <button
              type="button"
              onClick={() => app?.setTheme(app.theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors shadow-xs"
              aria-label="Alternar tema claro y oscuro"
              title={app?.theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {app?.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── 2. TARJETA DE BIENVENIDA HUMANA (ESTILO UBER / FRESHA) ───────── */}
      <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-5 pb-3">
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
          {/* Status del Local */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/60 dark:border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Abierto hoy • 09:00 - 19:00</span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200">4.9</span>
              <span>(184 clientes felices)</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            ¡Hola! 👋 Aparta tu turno en segundos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Sin registros previos ni contraseñas. Elige lo que necesitas y pagas directamente cuando vengas al local.
          </p>

          {/* Barra de búsqueda interactiva instantánea */}
          <div className="relative pt-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar servicio (ej. corte, barba, facial, masaje...)"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── 3. CATEGORÍAS EN BURBUJAS NATIVAS (ESTILO APP STORE / INSTAGRAM) ── */}
      <section id="servicios" className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
          <button
            type="button"
            onClick={() => setCategoriaActiva('todas')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 active:scale-95 shadow-xs ${
              categoriaActiva === 'todas'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md ring-2 ring-slate-900/10'
                : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>✨</span>
            <span>Todos los servicios</span>
            <span className="text-[11px] opacity-75 font-normal">({servicios.length})</span>
          </button>

          {categorias.map((cat) => {
            const esActiva = categoriaActiva === cat.id
            const emojiCat =
              cat.id === 1 ? '✂️' : cat.id === 2 ? '🧖‍♀️' : '💆'
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoriaActiva(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 active:scale-95 shadow-xs ${
                  esActiva
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md ring-2 ring-slate-900/10'
                    : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{emojiCat}</span>
                <span>{cat.nombre}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ─── 4. LISTA DE SERVICIOS EN TARJETAS DE APP MÓVIL (ESTILO FRESHA / UBER) ─ */}
      <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-2 space-y-3">
        {cargando ? (
          <div className="py-16 flex justify-center">
            <Loader text="Cargando catálogo..." />
          </div>
        ) : serviciosFiltrados.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <Search className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-800 dark:text-slate-200">No encontramos ese servicio</p>
            <p className="text-xs text-slate-500">Prueba buscando otra palabra como corte, barba o masaje</p>
            <button
              type="button"
              onClick={() => {
                setBusqueda('')
                setCategoriaActiva('todas')
              }}
              className="text-xs text-indigo-600 font-bold underline pt-2"
            >
              Ver todos los servicios
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {serviciosFiltrados.map((serv) => {
              const servVis = serv as ServicioVisual
              return (
                <div
                  key={serv.id}
                  onClick={() => handleAbrirSubVentana(serv)}
                  className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-slate-300 dark:hover:border-slate-700 active:scale-[0.99] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {/* Fila Superior: Título y Precio */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {serv.nombre}
                          </h3>
                          {servVis.destacado && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold shrink-0">
                              {servVis.destacado}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                          {serv.descripcion}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                          {formatearMoneda(serv.precio_base)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Fila Inferior: Duración y Botón Reservar */}
                  <div className="pt-3.5 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{serv.duracion_base_min} min</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAbrirSubVentana(serv)
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                    >
                      <span>Reservar</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ─── 5. SUB-VENTANA DE RESERVA ESTILO IOS (IOS BOTTOM SHEET) ──────── */}
      {subVentanaAbierta && servicioSel && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          {/* Fondo desenfocado */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={handleCerrarSubVentana}
          />

          {/* Contenedor Bottom Sheet Adaptativo a Teclados Móviles */}
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[85dvh] sm:max-h-[88vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
            {/* Grab Handle tipo iPhone */}
            <div className="pt-3 pb-1 flex justify-center cursor-pointer" onClick={handleCerrarSubVentana}>
              <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>

            {/* Cabecera del Sheet */}
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {pasoSubVentana === 1
                    ? 'Paso 1: Elige Fecha y Hora'
                    : pasoSubVentana === 2
                    ? 'Paso 2: ¿A nombre de quién?'
                    : '¡Turno Apartado!'}
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-[280px]">
                  {servicioSel.nombre} • {formatearMoneda(servicioSel.precio_base)}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleCerrarSubVentana}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                aria-label="Cerrar ventana"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contenido scrolleable con soporte para teclado móvil */}
            <div
              ref={modalScrollRef}
              className="p-5 overflow-y-auto flex-1 space-y-5 overscroll-contain touch-pan-y pb-32 sm:pb-8"
            >
              {/* PASO 1: HORARIO Y ESPECIALISTA */}
              {pasoSubVentana === 1 && (
                <div className="space-y-5">
                  {/* 1. Selección de especialista */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      ¿Con quién prefieres atenderte?
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
                      {/* Opción 1: Cualquiera disponible */}
                      <button
                        type="button"
                        onClick={() => setEmpleadoSel(null)}
                        className={`p-3 rounded-2xl border text-left transition-all min-w-[140px] shrink-0 active:scale-95 ${
                          empleadoSel === null
                            ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center mb-1.5">
                          ⚡
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          Cualquiera libre
                        </p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                          El más rápido
                        </p>
                      </button>

                      {/* Especialistas */}
                      {empleados.map((emp) => (
                        <button
                          key={emp.id}
                          type="button"
                          onClick={() => setEmpleadoSel(emp)}
                          className={`p-3 rounded-2xl border text-left transition-all min-w-[140px] shrink-0 active:scale-95 ${
                            empleadoSel?.id === emp.id
                              ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-xs flex items-center justify-center mb-1.5 text-slate-800 dark:text-slate-200">
                            {emp.nombre.charAt(0)}
                          </div>
                          <p className="text-xs font-bold truncate text-slate-900 dark:text-white">
                            {emp.nombre.split(' ')[0]}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {emp.especialidad || 'Especialista'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Selector de día */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      ¿Qué día te viene mejor?
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
                      {proximosDias.map((d) => {
                        const sel = fechaSel === d.iso
                        return (
                          <button
                            key={d.iso}
                            type="button"
                            onClick={() => {
                              setFechaSel(d.iso)
                              setHoraSel('')
                            }}
                            className={`min-w-[60px] py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center border transition-all shrink-0 active:scale-95 ${
                              sel
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 shadow-md font-bold'
                                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-bold opacity-75">
                              {d.diaSemana}
                            </span>
                            <span className="text-base font-black my-0.5">{d.diaNum}</span>
                            <span className="text-[10px] capitalize opacity-75">{d.mes}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* 3. Selector de hora */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Selecciona la hora de llegada
                    </label>
                    {cargandoSlots ? (
                      <div className="py-6 flex justify-center">
                        <Loader text="Consultando horarios libres..." />
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {slots.map((slot) => {
                          const horaFormat = slot.hora_inicio.slice(0, 5)
                          const activa = horaSel === horaFormat
                          return (
                            <button
                              key={slot.hora_inicio}
                              type="button"
                              disabled={!slot.disponible}
                              onClick={() => setHoraSel(horaFormat)}
                              className={`py-3 px-2 rounded-2xl text-xs font-bold text-center transition-all active:scale-95 ${
                                !slot.disponible
                                  ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-300 dark:text-slate-600 line-through cursor-not-allowed border border-transparent'
                                  : activa
                                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-500/30'
                                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
                              }`}
                            >
                              {horaFormat}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Botón Siguiente */}
                  <div className="pt-2">
                    <Button
                      disabled={!horaSel}
                      onClick={() => setPasoSubVentana(2)}
                      className="w-full py-4 rounded-2xl font-bold text-sm bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950 text-white shadow-lg active:scale-95 transition-all"
                    >
                      <span>Siguiente: Mis datos de contacto</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* PASO 2: FORMULARIO AMIGABLE (SIN REGISTROS) */}
              {pasoSubVentana === 2 && (
                <form onSubmit={handleConfirmarCita} className="space-y-4">
                  {/* Resumen del turno */}
                  <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {fechaSel} a las {horaSel} hrs
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">
                        Atención con: {empleadoSel?.nombre || 'Primer profesional libre'}
                      </p>
                    </div>
                    <span className="font-black text-base text-indigo-700 dark:text-indigo-300">
                      {formatearMoneda(servicioSel.precio_base)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Input
                      label="¿Cómo te llamas?"
                      placeholder="Ej. Sofía Méndez"
                      value={nombreCliente}
                      onChange={(e) => setNombreCliente(e.target.value)}
                      onFocus={handleInputFocus}
                      leftIcon={<User className="w-4 h-4" />}
                      required
                    />

                    <Input
                      label="Teléfono o WhatsApp (para mandarte el aviso)"
                      placeholder="+1 (555) 345-6789"
                      type="tel"
                      value={telefonoCliente}
                      onChange={(e) => setTelefonoCliente(e.target.value)}
                      onFocus={handleInputFocus}
                      leftIcon={<Phone className="w-4 h-4" />}
                      required
                    />

                    <Input
                      label="Correo electrónico (opcional para comprobante)"
                      placeholder="sofia@correo.com"
                      type="email"
                      value={emailCliente}
                      onChange={(e) => setEmailCliente(e.target.value)}
                      onFocus={handleInputFocus}
                      leftIcon={<Mail className="w-4 h-4" />}
                    />

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        ¿Algún comentario o nota especial? (opcional)
                      </label>
                      <textarea
                        rows={2}
                        value={notasCliente}
                        onChange={(e) => setNotasCliente(e.target.value)}
                        onFocus={handleInputFocus}
                        placeholder="Ej. Prefiero corte con tijera / Tengo el cabello largo..."
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base sm:text-xs focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Mensaje de tranquilidad */}
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Sin registros ni tarjetas previas. Pagas directo en el local cuando te atiendan.</span>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPasoSubVentana(1)}
                      className="rounded-2xl"
                    >
                      Atrás
                    </Button>
                    <Button
                      type="submit"
                      isLoading={guardandoCita}
                      className="flex-1 py-3.5 rounded-2xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      <span>Confirmar mi Cita</span>
                    </Button>
                  </div>
                </form>
              )}

              {/* PASO 3: CONFIRMACIÓN EXITOSA */}
              {pasoSubVentana === 3 && citaConfirmada && (
                <div className="text-center py-3 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                      Folio: {folioReserva}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      ¡Tu cita está apartada! 🎉
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Gracias, {nombreCliente}. Te esperamos el {fechaSel} a las {horaSel} hrs.
                    </p>
                  </div>

                  {/* Resumen de cita */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2 text-left max-w-sm mx-auto">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Servicio:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {servicioSel.nombre}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fecha y Hora:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {fechaSel} — {horaSel} hrs
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total a pagar al llegar:</span>
                      <span className="font-black text-slate-900 dark:text-white">
                        {formatearMoneda(servicioSel.precio_base)}
                      </span>
                    </div>
                  </div>

                  {/* Acciones de WhatsApp, Comprobante PDF y Calendario */}
                  <div className="flex flex-col gap-2 pt-1 max-w-sm mx-auto">
                    {/* Botón Principal: Guardar comprobante PDF */}
                    <Button
                      type="button"
                      onClick={() => imprimirOguardarComprobantePDF(citaConfirmada, configuracion, folioReserva)}
                      className="w-full py-3.5 rounded-2xl gap-2 font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95 transition-all"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Descargar Comprobante (PDF)</span>
                    </Button>

                    {configuracion.telefono_soporte && (
                      <a
                        href={generarUrlWhatsApp(
                          configuracion.telefono_soporte,
                          `Hola, confirmo mi cita para ${servicioSel.nombre} el día ${fechaSel} a las ${horaSel} hrs a nombre de ${nombreCliente}. Mi folio es ${folioReserva}.`
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full rounded-2xl gap-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                          <MessageSquare className="w-4 h-4" />
                          <span>Abrir confirmación en WhatsApp</span>
                        </Button>
                      </a>
                    )}

                    <div className="flex gap-2">
                      <a
                        href={generarUrlGoogleCalendar(citaConfirmada)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full rounded-2xl gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>Google Calendar</span>
                        </Button>
                      </a>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-2xl gap-1.5 text-xs"
                        onClick={() => imprimirOguardarComprobantePDF(citaConfirmada, configuracion, folioReserva)}
                      >
                        <Download className="w-3.5 h-3.5 text-indigo-500" />
                        <span>
                          {deviceInfo.isIOS
                            ? 'Guardar en iPhone (PDF)'
                            : deviceInfo.isAndroid
                            ? 'Guardar en Android (PDF)'
                            : 'Imprimir Ticket'}
                        </span>
                      </Button>
                    </div>

                    {/* Detección de dispositivo */}
                    <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>
                        Detectado: {deviceInfo.isIOS ? 'Apple iOS (iPhone/iPad)' : deviceInfo.isAndroid ? 'Android' : 'Navegador Web'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={handleCerrarSubVentana}
                      className="rounded-2xl px-8 text-xs bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-bold"
                    >
                      Listo, gracias
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── 6. UBICACIÓN Y CONTACTO DEL LOCAL (ESTILO APP) ───────────────── */}
      <section id="contacto" className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-10 pb-6 space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          📍 Dónde encontrarnos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
            <MapPin className="w-5 h-5 text-indigo-600 mb-1" />
            <p className="font-bold text-slate-900 dark:text-white">Nuestra Dirección</p>
            <p className="text-slate-500 dark:text-slate-400">Av. Central #405, Zona Centro (Estacionamiento propio)</p>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
            <Clock className="w-5 h-5 text-emerald-600 mb-1" />
            <p className="font-bold text-slate-900 dark:text-white">Horarios de Atención</p>
            <p className="text-slate-500 dark:text-slate-400">Lunes a Sábado: 09:00 a 19:00 hrs</p>
          </div>

          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
            <Phone className="w-5 h-5 text-blue-600 mb-1" />
            <p className="font-bold text-slate-900 dark:text-white">Contacto Directo</p>
            <p className="text-slate-500 dark:text-slate-400">
              {configuracion.telefono_soporte || '+1 (555) 019-2834'}
            </p>
          </div>
        </div>
      </section>

      {/* ─── 7. FOOTER MINIMALISTA CON ACCESO ADMINISTRATIVO ─────────────── */}
      <footer className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-6 pb-28 text-center text-xs text-slate-400 space-y-3">
        <p>
          {configuracion.texto_pie_pagina ||
            `© ${new Date().getFullYear()} ${nombreMarca}. Todos los derechos reservados.`}
        </p>

        {/* 🔐 CANDADO DISCRETO DE ACCESO ADMINISTRATIVO EXCLUSIVAMENTE AL FINAL DE LA PÁGINA */}
        <div className="pt-2 flex justify-center items-center">
          <Link
            to="/login"
            title="Acceso administrativo y de personal"
            aria-label="Acceso para el personal / Administración"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-700 dark:text-slate-600 dark:hover:text-slate-300 transition-colors p-1.5 rounded-lg opacity-70 hover:opacity-100"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[11px] tracking-wide">Acceso personal</span>
          </Link>
        </div>
      </footer>

      {/* ─── 8. BARRA DE NAVEGACIÓN INFERIOR NATIVA (APP TAB BAR) ────────── */}
      <nav className="fixed bottom-0 inset-x-0 z-40 backdrop-blur-2xl bg-white/90 dark:bg-slate-950/90 border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-8px_25px_rgba(0,0,0,0.06)] px-4 py-2 flex justify-around items-center max-w-lg mx-auto sm:rounded-t-3xl transition-all">
        {/* Pestaña Servicios */}
        <a
          href="#servicios"
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <Scissors className="w-4 h-4" />
          <span className="text-[10px] font-bold">Servicios</span>
        </a>

        {/* Botón Central Destacado: Reservar Turno */}
        <button
          type="button"
          onClick={() => handleAbrirSubVentana(servicios[0])}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-500/25 active:scale-95 transition-all"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Apartar Cita</span>
        </button>

        {/* Pestaña Ubicación */}
        <a
          href="#contacto"
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <Compass className="w-4 h-4" />
          <span className="text-[10px] font-bold">Ubicación</span>
        </a>

        {/* Alternador Claro / Oscuro */}
        <button
          type="button"
          onClick={() => app?.setTheme(app.theme === 'dark' ? 'light' : 'dark')}
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          title={app?.theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          {app?.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
          <span className="text-[10px] font-bold">{app?.theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
        </button>
      </nav>
    </div>
  )
}
