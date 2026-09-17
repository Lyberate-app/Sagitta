import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { ReservaProvider, ReservaContext } from '@/context/ReservaContext'
import {
  PasoServicio,
  PasoEmpleado,
  PasoFechaHora,
  PasoConfirmacion,
  CarritoReserva,
} from '@/components/reservas'
import { Stepper, Button, Modal } from '@/components/ui'
import { useToast } from '@/hooks/useToast'
import { citasService } from '@/services/citas.service'
import { TipoRecurrencia } from '@/types'

const STEPS = [
  { id: 1, title: 'Servicio', subtitle: 'Qué deseas agendar' },
  { id: 2, title: 'Profesional', subtitle: 'Quién te atenderá' },
  { id: 3, title: 'Fecha y Hora', subtitle: 'Cuándo será' },
  { id: 4, title: 'Confirmar', subtitle: 'Resumen y notas' },
]

function WizardContent() {
  const ctx = useContext(ReservaContext)
  const navigate = useNavigate()
  const { toast } = useToast()
  const [cargando, setCargando] = useState(false)
  const [verCarrito, setVerCarrito] = useState(false)

  if (!ctx) return null
  const {
    estado,
    irAPaso,
    seleccionarServicio,
    seleccionarEmpleado,
    seleccionarFechaHora,
    setNotas,
    agregarAlCarrito,
    quitarDelCarrito,
    reset,
  } = ctx

  const handleConfirmar = async (datosExtra: { recurrencia?: { tipo: TipoRecurrencia; intervalo: number } }) => {
    if (!estado.servicioSeleccionado || !estado.empleadoSeleccionado || !estado.fechaSeleccionada || !estado.horaSeleccionada) {
      toast.warning('Datos incompletos', 'Asegúrate de completar todos los pasos')
      return
    }

    setCargando(true)
    try {
      const durMin = estado.duracionSeleccionada?.duracion_min ?? estado.servicioSeleccionado.duracion_base_min
      const fechaInicio = `${estado.fechaSeleccionada} ${estado.horaSeleccionada}:00`

      // Calcular fecha fin simple sumando minutos
      const [h, m] = estado.horaSeleccionada.split(':').map(Number)
      const totalMin = h * 60 + m + durMin
      const hFin = String(Math.floor(totalMin / 60)).padStart(2, '0')
      const mFin = String(totalMin % 60).padStart(2, '0')
      const fechaFin = `${estado.fechaSeleccionada} ${hFin}:${mFin}:00`

      await citasService.create({
        cliente_id: 1, // cliente mock actual
        empleado_id: estado.empleadoSeleccionado.id,
        servicio_id: estado.servicioSeleccionado.id,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        precio_total: estado.duracionSeleccionada?.precio ?? estado.servicioSeleccionado.precio_base,
        estado: 'confirmada',
        notas: estado.notas,
        recurrencia: datosExtra.recurrencia ? {
          id: Date.now(),
          tipo: datosExtra.recurrencia.tipo,
          intervalo: datosExtra.recurrencia.intervalo,
        } : undefined,
      })

      toast.success('¡Cita agendada con éxito!', 'Tu cita ha sido confirmada en el calendario')
      reset()
      navigate('/citas')
    } catch (err) {
      toast.error('Error al agendar cita', err instanceof Error ? err.message : 'Error')
    } finally {
      setCargando(false)
    }
  }

  const handleAgregarAlCarrito = () => {
    if (!estado.servicioSeleccionado) return
    agregarAlCarrito({
      id: crypto.randomUUID(),
      servicio: estado.servicioSeleccionado,
      duracion: estado.duracionSeleccionada,
      empleado: estado.empleadoSeleccionado,
      fecha_inicio: estado.fechaSeleccionada && estado.horaSeleccionada ? `${estado.fechaSeleccionada} ${estado.horaSeleccionada}` : undefined,
      precio: estado.duracionSeleccionada?.precio ?? estado.servicioSeleccionado.precio_base,
    })
    toast.success('Servicio añadido al carrito', 'Puedes añadir más servicios antes de confirmar')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/citas"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Citas
        </Link>

        {/* Botón Carrito */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setVerCarrito(true)}
          leftIcon={<ShoppingBag className="w-4 h-4" />}
        >
          Carrito ({estado.carrito.length})
        </Button>
      </div>

      {/* Stepper Wizard */}
      <div className="card p-6 shadow-card">
        <Stepper
          steps={STEPS}
          currentStep={estado.paso}
          onStepClick={(pasoId) => irAPaso(pasoId as 1 | 2 | 3 | 4)}
        />
      </div>

      {/* Contenido según el Paso */}
      <div className="card p-6 shadow-card">
        {estado.paso === 1 && (
          <PasoServicio
            servicioSeleccionado={estado.servicioSeleccionado}
            duracionSeleccionada={estado.duracionSeleccionada}
            onSeleccionar={(s, d) => seleccionarServicio(s, d)}
            onSiguiente={() => irAPaso(2)}
          />
        )}

        {estado.paso === 2 && (
          <PasoEmpleado
            empleadoSeleccionado={estado.empleadoSeleccionado}
            onSeleccionar={(e) => seleccionarEmpleado(e)}
            onAnterior={() => irAPaso(1)}
            onSiguiente={() => irAPaso(3)}
          />
        )}

        {estado.paso === 3 && (
          <PasoFechaHora
            empleado={estado.empleadoSeleccionado}
            servicio={estado.servicioSeleccionado}
            fechaSeleccionada={estado.fechaSeleccionada}
            horaSeleccionada={estado.horaSeleccionada}
            onSeleccionar={(f, h) => seleccionarFechaHora(f, h)}
            onAnterior={() => irAPaso(2)}
            onSiguiente={() => irAPaso(4)}
          />
        )}

        {estado.paso === 4 && (
          <PasoConfirmacion
            servicio={estado.servicioSeleccionado}
            duracion={estado.duracionSeleccionada}
            empleado={estado.empleadoSeleccionado}
            fecha={estado.fechaSeleccionada}
            hora={estado.horaSeleccionada}
            notas={estado.notas}
            onNotasChange={(n) => setNotas(n)}
            onAnterior={() => irAPaso(3)}
            onConfirmar={handleConfirmar}
            cargando={cargando}
          />
        )}
      </div>

      {/* Modal Carrito de compras / multi-servicios */}
      <Modal
        isOpen={verCarrito}
        onClose={() => setVerCarrito(false)}
        title="Carrito de Citas Múltiples"
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAgregarAlCarrito}
              disabled={!estado.servicioSeleccionado}
            >
              Añadir selección actual
            </Button>
            <Button size="sm" onClick={() => setVerCarrito(false)}>
              Cerrar
            </Button>
          </div>
        }
      >
        <CarritoReserva
          items={estado.carrito}
          onEliminar={(id) => quitarDelCarrito(id)}
        />
      </Modal>
    </div>
  )
}

export default function NuevaCitaPage() {
  return (
    <ReservaProvider>
      <WizardContent />
    </ReservaProvider>
  )
}
