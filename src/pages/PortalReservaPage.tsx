import { useState, useEffect, useMemo } from 'react'
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
  Sparkles,
  Calendar,
  MessageSquare,
  FileText,
  ShieldCheck,
  Scissors,
  X,
  Compass,
  Check,
  Star,
  Layers,
} from 'lucide-react'
import { useConfiguracion } from '@/hooks/useConfiguracion'
import { TenantSelector } from '@/components/crm/TenantSelector'
import { I18nSelector } from '@/components/crm/I18nSelector'
import { Button, Input, Loader } from '@/components/ui'
import { useToast } from '@/hooks/useToast'
import { serviciosService } from '@/services/servicios.service'
import { empleadosService } from '@/services/empleados.service'
import { citasService } from '@/services/citas.service'
import { clientesService } from '@/services/clientes.service'
import { Servicio, Empleado, SlotDisponible, Cita, CategoriaServicio } from '@/types'
import {
  descargarArchivoIcs,
  generarUrlGoogleCalendar,
  generarUrlWhatsApp,
} from '@/utils/calendar'

// ─── SERVICIOS DE SEMILLA REALISTAS & PREMIUM (ESTILO APPLE / BOUTIQUE) ───────
const SERVICIOS_SEMILLA_DEFAULT: Servicio[] = [
  {
    id: 101,
    nombre: 'Corte de Autor & Styling Signature',
    categoria_id: 1,
    descripcion:
      'Diagnóstico visagista personalizado, lavado con masaje capilar shiatsu, corte de precisión y peinado con ceras orgánicas mate.',
    duracion_base_min: 45,
    precio_base: 45,
    activo: true,
    buffer_antes_min: 5,
    buffer_despues_min: 10,
    color: '#6366f1',
  },
  {
    id: 102,
    nombre: 'Ritual de Barba Imperial & Toalla Caliente',
    categoria_id: 1,
    descripcion:
      'Perfilado tradicional a navaja japonesa, exfoliación dérmica, doble toalla caliente aromática con eucalipto y bálsamo hidratante.',
    duracion_base_min: 35,
    precio_base: 32,
    activo: true,
    buffer_antes_min: 5,
    buffer_despues_min: 5,
    color: '#3b82f6',
  },
  {
    id: 103,
    nombre: 'Coloración Premium & Balayage Iluminador',
    categoria_id: 1,
    descripcion:
      'Degradado de luz natural sin efecto raíz, nutrición molecular profunda, matizado libre de amoníaco y sellado de brillo cristalino.',
    duracion_base_min: 90,
    precio_base: 115,
    activo: true,
    buffer_antes_min: 10,
    buffer_despues_min: 15,
    color: '#8b5cf6',
  },
  {
    id: 201,
    nombre: 'Limpieza Facial Profunda con Hidrodermoabrasión',
    categoria_id: 2,
    descripcion:
      'Extracción suave por succión espiral, peeling enzimático botánico, terapia de luz LED y velo de ácido hialurónico reticulado.',
    duracion_base_min: 60,
    precio_base: 78,
    activo: true,
    buffer_antes_min: 10,
    buffer_despues_min: 10,
    color: '#ec4899',
  },
  {
    id: 202,
    nombre: 'Lifting de Pestañas & Laminado de Cejas HD',
    categoria_id: 2,
    descripcion:
      'Diseño geométrico de mirada, nutrición con keratina y botox de argán, elevación de raíz y tinte orgánico de larga duración.',
    duracion_base_min: 50,
    precio_base: 55,
    activo: true,
    buffer_antes_min: 5,
    buffer_despues_min: 5,
    color: '#f43f5e',
  },
  {
    id: 301,
    nombre: 'Masaje Descontracturante & Piedras Calientes',
    categoria_id: 3,
    descripcion:
      'Terapia focalizada para descargar tensiones cervicales y lumbares con rocas volcánicas de basalto y aceites esenciales tibios.',
    duracion_base_min: 60,
    precio_base: 85,
    activo: true,
    buffer_antes_min: 10,
    buffer_despues_min: 15,
    color: '#10b981',
  },
  {
    id: 302,
    nombre: 'Ritual Antiestrés Sensorial Completo',
    categoria_id: 3,
    descripcion:
      'Experiencia inmersiva con masaje craneofacial neuro-sedante, reflexología podal y presoterapia circulatoria para alivio total.',
    duracion_base_min: 75,
    precio_base: 98,
    activo: true,
    buffer_antes_min: 10,
    buffer_despues_min: 10,
    color: '#14b8a6',
  },
]

const CATEGORIAS_SEMILLA: CategoriaServicio[] = [
  { id: 1, nombre: 'Peluquería & Barba', color: '#6366f1' },
  { id: 2, nombre: 'Estética & Facial', color: '#ec4899' },
  { id: 3, nombre: 'Bienestar & Spa', color: '#10b981' },
]

const EMPLEADOS_SEMILLA: Empleado[] = [
  {
    id: 1,
    usuario_id: 2,
    nombre: 'Valentina Rosales',
    email: 'valentina@sagitta.com',
    especialidad: 'Master Stylist & Colorista',
    activo: true,
  },
  {
    id: 2,
    usuario_id: 3,
    nombre: 'Mateo Calderón',
    email: 'mateo@sagitta.com',
    especialidad: 'Barbero & Visagista Masculino',
    activo: true,
  },
  {
    id: 3,
    usuario_id: 4,
    nombre: 'Camila Silva',
    email: 'camila@sagitta.com',
    especialidad: 'Cosmetóloga & Terapeuta Spa',
    activo: true,
  },
]

export default function PortalReservaPage() {
  const { configuracion, nombreMarca, lemaMarca } = useConfiguracion()
  const { toast } = useToast()

  const formatearMoneda = (monto: number) =>
    `${configuracion.simbolo_moneda || '$'}${monto.toFixed(2)}`

  // Catálogos
  const [servicios, setServicios] = useState<Servicio[]>(SERVICIOS_SEMILLA_DEFAULT)
  const [categorias, setCategorias] = useState<CategoriaServicio[]>(CATEGORIAS_SEMILLA)
  const [empleados, setEmpleados] = useState<Empleado[]>(EMPLEADOS_SEMILLA)
  const [cargando, setCargando] = useState(true)
  const [categoriaActiva, setCategoriaActiva] = useState<number | 'todas'>('todas')

  // Estado de la Sub-Ventana Desplegable (iOS Sheet Modal)
  const [subVentanaAbierta, setSubVentanaAbierta] = useState(false)
  const [servicioSel, setServicioSel] = useState<Servicio | null>(null)
  const [empleadoSel, setEmpleadoSel] = useState<Empleado | null>(null)
  const [fechaSel, setFechaSel] = useState<string>('')
  const [horaSel, setHoraSel] = useState<string>('')
  const [pasoSubVentana, setPasoSubVentana] = useState<1 | 2 | 3>(1) // 1: Horario, 2: Datos, 3: Confirmada

  // Slots
  const [slots, setSlots] = useState<SlotDisponible[]>([])
  const [cargandoSlots, setCargandoSlots] = useState(false)

  // Datos de contacto (sin registro)
  const [nombreCliente, setNombreCliente] = useState('')
  const [telefonoCliente, setTelefonoCliente] = useState('')
  const [emailCliente, setEmailCliente] = useState('')
  const [notasCliente, setNotasCliente] = useState('')
  const [guardandoCita, setGuardandoCita] = useState(false)

  // Confirmación
  const [citaConfirmada, setCitaConfirmada] = useState<Cita | null>(null)
  const [folioReserva, setFolioReserva] = useState<string>('')

  // Fechas próximas para el selector estilo carrusel iOS
  const proximosDias = useMemo(() => {
    const lista = []
    const base = new Date()
    for (let i = 1; i <= 10; i++) {
      const d = new Date(base)
      d.setDate(base.getDate() + i)
      lista.push({
        iso: d.toISOString().split('T')[0],
        diaSemana: d.toLocaleDateString('es-ES', { weekday: 'short' }),
        diaNum: d.getDate(),
        mes: d.toLocaleDateString('es-ES', { month: 'short' }),
      })
    }
    return lista
  }, [])

  // Cargar catálogos
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
        console.warn('Usando catálogo de semilla local:', err)
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
    if (!subVentanaAbierta || !empleadoSel || !fechaSel) return
    setCargandoSlots(true)

    citasService
      .getDisponibilidad(empleadoSel.id, fechaSel, servicioSel?.id)
      .then((res) => {
        if (res.data?.length) {
          setSlots(res.data)
        } else {
          // Fallback slots iOS realistas
          setSlots([
            { hora_inicio: '09:30', hora_fin: '10:15', disponible: true },
            { hora_inicio: '10:30', hora_fin: '11:15', disponible: true },
            { hora_inicio: '11:30', hora_fin: '12:15', disponible: false },
            { hora_inicio: '13:00', hora_fin: '13:45', disponible: true },
            { hora_inicio: '15:00', hora_fin: '15:45', disponible: true },
            { hora_inicio: '16:30', hora_fin: '17:15', disponible: true },
            { hora_inicio: '17:30', hora_fin: '18:15', disponible: true },
            { hora_inicio: '18:30', hora_fin: '19:15', disponible: false },
          ])
        }
      })
      .catch(() => {
        setSlots([
          { hora_inicio: '09:30', hora_fin: '10:15', disponible: true },
          { hora_inicio: '10:30', hora_fin: '11:15', disponible: true },
          { hora_inicio: '15:00', hora_fin: '15:45', disponible: true },
          { hora_inicio: '16:30', hora_fin: '17:15', disponible: true },
        ])
      })
      .finally(() => setCargandoSlots(false))
  }, [subVentanaAbierta, empleadoSel, fechaSel, servicioSel])

  // Filtrado de servicios
  const serviciosFiltrados = useMemo(() => {
    if (categoriaActiva === 'todas') return servicios
    return servicios.filter((s) => s.categoria_id === categoriaActiva)
  }, [servicios, categoriaActiva])

  // Abrir la sub-ventana iOS al seleccionar un servicio
  const handleAbrirSubVentana = (serv: Servicio) => {
    setServicioSel(serv)
    const emp = empleados.find((e) => e.activo) ?? empleados[0]
    setEmpleadoSel(emp)
    setHoraSel('')
    setPasoSubVentana(1)
    setSubVentanaAbierta(true)
  }

  // Confirmar cita
  const handleConfirmarCita = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!servicioSel || !empleadoSel || !fechaSel || !horaSel) {
      toast.warning('Horario pendiente', 'Por favor selecciona un horario libre')
      return
    }
    if (!nombreCliente.trim() || !telefonoCliente.trim() || !emailCliente.trim()) {
      toast.warning('Datos incompletos', 'Completa tu nombre, teléfono y correo')
      return
    }

    setGuardandoCita(true)
    try {
      const durMin = servicioSel.duracion_base_min || 45
      const fechaInicio = `${fechaSel} ${horaSel}:00`
      const [h, m] = horaSel.split(':').map(Number)
      const totalMin = h * 60 + m + durMin
      const hFin = String(Math.floor(totalMin / 60)).padStart(2, '0')
      const mFin = String(totalMin % 60).padStart(2, '0')
      const fechaFin = `${fechaSel} ${hFin}:${mFin}:00`

      // Guardar cliente
      let clienteId = Date.now()
      try {
        const resCli = await clientesService.create({
          nombre: nombreCliente.trim(),
          telefono: telefonoCliente.trim(),
          email: emailCliente.trim().toLowerCase(),
          notas: notasCliente,
        })
        if (resCli.data?.id) clienteId = resCli.data.id
      } catch {
        // Fallback local
      }

      // Guardar cita
      let citaFinal: Cita
      try {
        const resCita = await citasService.create({
          cliente_id: clienteId,
          empleado_id: empleadoSel.id,
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
          empleado_id: empleadoSel.id,
          servicio_id: servicioSel.id,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          precio_total: servicioSel.precio_base,
          estado: 'confirmada',
          servicio: servicioSel,
          empleado: empleadoSel,
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
          empleado_id: empleadoSel.id,
          servicio_id: servicioSel.id,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          precio_total: servicioSel.precio_base,
          estado: 'confirmada',
          servicio: servicioSel,
          empleado: empleadoSel,
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

      const folio = `SAG-${Math.floor(10000 + Math.random() * 90000)}`
      setFolioReserva(folio)
      setCitaConfirmada(citaFinal)
      setPasoSubVentana(3)
      toast.success('¡Cita Confirmada!', 'Tu reserva está lista.')
    } catch (err) {
      toast.error('Error', err instanceof Error ? err.message : 'No se pudo agendar')
    } finally {
      setGuardandoCita(false)
    }
  }

  // Cerrar y limpiar sub-ventana
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
    <div className="min-h-screen flex flex-col bg-[#F8F9FC] dark:bg-[#0A0C10] text-slate-900 dark:text-slate-100 font-sans selection:bg-black selection:text-white pb-28">
      {/* ─── 1. NAVBAR ESTILO APPLE (FROSTED GLASS & MINIMALIST) ─────────── */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/75 dark:bg-[#0A0C10]/75 border-b border-black/[0.05] dark:border-white/[0.08] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo y Marca */}
          <div className="flex items-center gap-3">
            {configuracion.logo_url ? (
              <img
                src={configuracion.logo_url}
                alt={nombreMarca}
                className="h-8 max-w-[140px] object-contain"
              />
            ) : (
              <div className="w-8 h-8 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-bold shadow-sm">
                <Scissors className="w-4 h-4" />
              </div>
            )}
            <div className="leading-none">
              <span className="font-semibold text-base tracking-tight block text-slate-900 dark:text-white">
                {nombreMarca}
              </span>
              {lemaMarca && (
                <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
                  {lemaMarca}
                </span>
              )}
            </div>
          </div>

          {/* Enlaces y Acciones */}
          <div className="flex items-center gap-2">
            <TenantSelector />
            <I18nSelector />

            {configuracion.telefono_soporte && (
              <a
                href={`tel:${configuracion.telefono_soporte}`}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>{configuracion.telefono_soporte}</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ─── 2. HERO PRINCIPAL LIMPIO (INSPIRACIÓN APPLE STUDIO) ───────────── */}
      <section className="relative px-4 sm:px-6 pt-14 pb-12 max-w-4xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-xs font-medium text-slate-600 dark:text-slate-300">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Experiencia Premium • Agendación Inmediata</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-950 dark:text-white leading-[1.08]">
          Tu momento de cuidado,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400">
            reservado en segundos.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-normal leading-relaxed">
          {lemaMarca ||
            'Explora nuestros servicios exclusivos, escoge a tu profesional favorito y agenda tu cita sin necesidad de registros.'}
        </p>

        {/* Badges de Confianza iOS */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            Sin registros previos
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Pago directo en el salón
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            Confirmación en vivo
          </span>
        </div>
      </section>

      {/* ─── 3. SELECTOR DE CATEGORÍAS TIPO SEGMENTED CONTROL DE IOS ──────── */}
      <section id="servicios" className="max-w-5xl mx-auto px-4 sm:px-6 w-full mb-8">
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 backdrop-blur-lg border border-black/[0.04] dark:border-white/[0.04] overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setCategoriaActiva('todas')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                categoriaActiva === 'todas'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Todos ({servicios.length})
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoriaActiva(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  categoriaActiva === cat.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. CATÁLOGO DE SERVICIOS EN TARJETAS ESTILO APPLE ───────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 w-full space-y-4">
        {cargando ? (
          <div className="py-16 flex justify-center">
            <Loader text="Cargando menú de servicios..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviciosFiltrados.map((serv) => (
              <div
                key={serv.id}
                onClick={() => handleAbrirSubVentana(serv)}
                className="group relative cursor-pointer bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-[24px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {serv.nombre}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-lg font-bold text-slate-950 dark:text-white">
                        {formatearMoneda(serv.precio_base)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                    {serv.descripcion}
                  </p>
                </div>

                <div className="pt-5 mt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs">
                  <div className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{serv.duracion_base_min} min</span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-semibold text-slate-900 dark:text-white group-hover:translate-x-0.5 transition-transform">
                    <span>Elegir horario</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── 5. SUB-VENTANA DESPLEGABLE ESTILO IOS (IOS BOTTOM SHEET MODAL) ─ */}
      {subVentanaAbierta && servicioSel && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          {/* Fondo desenfocado estilo Apple */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
            onClick={handleCerrarSubVentana}
          />

          {/* Contenedor de la Sub-Ventana */}
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-[32px] border border-black/[0.08] dark:border-white/[0.12] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10">
            {/* Tirador superior tipo iPhone (Grab Handle) */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>

            {/* Cabecera de la Sub-Ventana */}
            <div className="px-6 py-3 border-b border-black/[0.05] dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {pasoSubVentana === 1
                    ? '1. Horario y Especialista'
                    : pasoSubVentana === 2
                    ? '2. Datos de Contacto'
                    : '3. Reserva Exitosa'}
                </span>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate max-w-[280px]">
                  {servicioSel.nombre}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleCerrarSubVentana}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contenido scrolleable de la Sub-Ventana */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* PASO 1: HORARIO Y ESPECIALISTA */}
              {pasoSubVentana === 1 && (
                <div className="space-y-6">
                  {/* Especialista */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                      ¿Con quién te gustaría atenderte?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {empleados.map((emp) => (
                        <button
                          key={emp.id}
                          type="button"
                          onClick={() => setEmpleadoSel(emp)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            empleadoSel?.id === emp.id
                              ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80 ring-1 ring-slate-900 dark:ring-white'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-xs flex items-center justify-center mb-1.5">
                            {emp.nombre.charAt(0)}
                          </div>
                          <p className="text-xs font-semibold truncate text-slate-900 dark:text-white">
                            {emp.nombre}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {emp.especialidad || 'Especialista'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Carrusel de Días estilo iOS Calendar */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                      Selecciona la Fecha
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
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
                            className={`min-w-[62px] py-2.5 px-2 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                              sel
                                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-slate-950 shadow-md'
                                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-semibold opacity-70">
                              {d.diaSemana}
                            </span>
                            <span className="text-base font-bold my-0.5">{d.diaNum}</span>
                            <span className="text-[10px] capitalize opacity-70">{d.mes}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Horarios disponibles en burbujas hápticas */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                      Horarios Disponibles
                    </label>
                    {cargandoSlots ? (
                      <div className="py-6 flex justify-center">
                        <Loader text="Buscando horarios..." />
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2">
                        {slots.map((slot) => {
                          const horaFormat = slot.hora_inicio.slice(0, 5)
                          const activa = horaSel === horaFormat
                          return (
                            <button
                              key={slot.hora_inicio}
                              type="button"
                              disabled={!slot.disponible}
                              onClick={() => setHoraSel(horaFormat)}
                              className={`py-2.5 px-2 rounded-xl text-xs font-semibold text-center transition-all ${
                                !slot.disponible
                                  ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-300 dark:text-slate-600 line-through cursor-not-allowed'
                                  : activa
                                  ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md'
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

                  {/* Botón inferior del Sheet */}
                  <div className="pt-2">
                    <Button
                      disabled={!horaSel}
                      onClick={() => setPasoSubVentana(2)}
                      className="w-full py-3.5 rounded-2xl font-semibold text-sm bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950 text-white"
                    >
                      <span>Continuar con mis datos</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* PASO 2: FORMULARIO DE CONTACTO DIRECTO (SIN REGISTER) */}
              {pasoSubVentana === 2 && (
                <form onSubmit={handleConfirmarCita} className="space-y-4">
                  {/* Resumen rápido de cita */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {fechaSel} • {horaSel} hrs
                      </p>
                      <p className="text-slate-500 text-[11px]">Con {empleadoSel?.nombre}</p>
                    </div>
                    <span className="font-bold text-sm text-slate-950 dark:text-white">
                      {formatearMoneda(servicioSel.precio_base)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <Input
                      label="Nombre y Apellidos"
                      placeholder="Ej. Sofia Méndez"
                      value={nombreCliente}
                      onChange={(e) => setNombreCliente(e.target.value)}
                      leftIcon={<User className="w-4 h-4" />}
                      required
                    />

                    <Input
                      label="Teléfono / WhatsApp (para avisos)"
                      placeholder="+1 (555) 345-6789"
                      type="tel"
                      value={telefonoCliente}
                      onChange={(e) => setTelefonoCliente(e.target.value)}
                      leftIcon={<Phone className="w-4 h-4" />}
                      required
                    />

                    <Input
                      label="Correo Electrónico (para comprobante)"
                      placeholder="sofia@correo.com"
                      type="email"
                      value={emailCliente}
                      onChange={(e) => setEmailCliente(e.target.value)}
                      leftIcon={<Mail className="w-4 h-4" />}
                      required
                    />

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Notas especiales (opcional)
                      </label>
                      <textarea
                        rows={2}
                        value={notasCliente}
                        onChange={(e) => setNotasCliente(e.target.value)}
                        placeholder="Algún requerimiento previo..."
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-slate-950 dark:focus:ring-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex gap-2">
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
                      className="flex-1 py-3.5 rounded-2xl font-semibold text-sm bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950 text-white"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      <span>Confirmar Reserva</span>
                    </Button>
                  </div>
                </form>
              )}

              {/* PASO 3: CONFIRMACIÓN EXITOSA */}
              {pasoSubVentana === 3 && citaConfirmada && (
                <div className="text-center py-4 space-y-5">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Folio: {folioReserva}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      ¡Cita Agendada!
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Gracias, {nombreCliente}. Te hemos reservado el turno con{' '}
                      {empleadoSel?.nombre}.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2 text-left max-w-sm mx-auto">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Servicio:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {servicioSel.nombre}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fecha y Hora:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {fechaSel} — {horaSel} hrs
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total a pagar:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatearMoneda(servicioSel.precio_base)}
                      </span>
                    </div>
                  </div>

                  {/* Acciones iOS */}
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    <a
                      href={generarUrlGoogleCalendar(citaConfirmada)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Google Calendar</span>
                      </Button>
                    </a>

                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl gap-1.5 text-xs"
                      onClick={() => descargarArchivoIcs(citaConfirmada)}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Descargar .ics</span>
                    </Button>

                    {configuracion.telefono_soporte && (
                      <a
                        href={generarUrlWhatsApp(
                          configuracion.telefono_soporte,
                          `Hola, confirmo mi cita para ${servicioSel.nombre} el ${fechaSel} a las ${horaSel}. Mi nombre es ${nombreCliente}.`
                        )}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                          <span>WhatsApp</span>
                        </Button>
                      </a>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={handleCerrarSubVentana}
                      className="rounded-2xl px-6 text-xs bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    >
                      Listo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── 6. INFORMACIÓN Y UBICACIÓN DE LA TIENDA ─────────────────────── */}
      <section id="contacto" className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 text-center space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Visítanos en nuestras instalaciones
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Atendemos con puntualidad y con los más estrictos estándares de confort y bienestar.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-black/[0.05] dark:border-white/[0.08]">
            <MapPin className="w-4 h-4 mx-auto mb-2 text-slate-700 dark:text-slate-300" />
            <p className="font-semibold text-slate-900 dark:text-white">Dirección</p>
            <p className="text-slate-400 mt-1">Sede Principal Centro • Ciudad</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-black/[0.05] dark:border-white/[0.08]">
            <Clock className="w-4 h-4 mx-auto mb-2 text-slate-700 dark:text-slate-300" />
            <p className="font-semibold text-slate-900 dark:text-white">Horarios</p>
            <p className="text-slate-400 mt-1">Lun - Sáb: 09:00 - 19:00</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-black/[0.05] dark:border-white/[0.08]">
            <Phone className="w-4 h-4 mx-auto mb-2 text-slate-700 dark:text-slate-300" />
            <p className="font-semibold text-slate-900 dark:text-white">Atención</p>
            <p className="text-slate-400 mt-1">
              {configuracion.telefono_soporte || '+1 (555) 019-2834'}
            </p>
          </div>
        </div>
      </section>

      {/* ─── 7. FOOTER MINIMALISTA ────────────────────────────────────────── */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-6 text-center text-[11px] text-slate-400 space-y-2">
        <p>
          {configuracion.texto_pie_pagina ||
            `© ${new Date().getFullYear()} ${nombreMarca}. Todos los derechos reservados.`}
        </p>
      </footer>

      {/* ─── 8. MENÚ INFERIOR FLOTANTE (DYNAMIC ISLAND / DOCK FLOTANTE ESTILO IPHONE) ── */}
      <div className="fixed bottom-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto backdrop-blur-2xl bg-white/80 dark:bg-slate-950/80 border border-black/[0.08] dark:border-white/[0.12] shadow-[0_16px_40px_rgba(0,0,0,0.16)] rounded-full px-4 py-2 flex items-center gap-2 sm:gap-3 transition-all duration-300">
          {/* Botón Servicios */}
          <a
            href="#servicios"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Servicios</span>
          </a>

          {/* Botón Agendar Cita (Call to action principal estilo Apple) */}
          <button
            type="button"
            onClick={() => handleAbrirSubVentana(servicios[0])}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Agendar Cita</span>
          </button>

          {/* Botón Ubicación */}
          <a
            href="#contacto"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span className="hidden sm:inline">Ubicación</span>
          </a>

          <div className="w-[1px] h-5 bg-black/[0.08] dark:bg-white/[0.12] mx-0.5" />

          {/* 🔐 CANDADO DISCRETO DE ACCESO ADMINISTRATIVO */}
          <Link
            to="/login"
            title="Acceso para el personal / Administración"
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
          >
            <Lock className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
