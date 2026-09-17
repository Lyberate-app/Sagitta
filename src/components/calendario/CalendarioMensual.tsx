import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Cita } from '@/types'
import { Badge, Button } from '@/components/ui'

interface CalendarioMensualProps {
  citas: Cita[]
  onSeleccionarCita?: (cita: Cita) => void
  onCrearCitaEnFecha?: (fecha: string) => void
}

export function CalendarioMensual({
  citas,
  onSeleccionarCita,
}: CalendarioMensualProps) {
  const [fechaActual, setFechaActual] = useState(new Date())
  const hoyStr = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [diaSelStr, setDiaSelStr] = useState<string>(hoyStr)

  const anio = fechaActual.getFullYear()
  const mes = fechaActual.getMonth()

  const primerDiaMes = new Date(anio, mes, 1).getDay()
  const diasEnMes = new Date(anio, mes + 1, 0).getDate()

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const cambiarMes = (offset: number) => {
    const nuevaFecha = new Date(anio, mes + offset, 1)
    setFechaActual(nuevaFecha)
  }

  // Citas para el día seleccionado
  const citasDelDiaSeleccionado = useMemo(() => {
    return citas.filter((c) => (c.fecha_inicio || '').slice(0, 10) === diaSelStr)
  }, [citas, diaSelStr])

  // Formato amigable para el encabezado del día seleccionado
  const fechaDiaSelFormateada = useMemo(() => {
    const [y, m, d] = diaSelStr.split('-').map(Number)
    if (!y || !m || !d) return diaSelStr
    const fechaObj = new Date(y, m - 1, d)
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }, [diaSelStr])

  return (
    <div className="space-y-6">
      {/* Contenedor del Calendario */}
      <div className="card p-4 sm:p-6 shadow-card border border-slate-100 dark:border-slate-800">
        {/* Header del mes */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 capitalize">
              {fechaActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
              Toca cualquier día con indicador para ver los turnos agendados
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => cambiarMes(-1)}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => {
                const hoy = new Date()
                setFechaActual(hoy)
                setDiaSelStr(hoy.toISOString().slice(0, 10))
              }}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              Hoy
            </button>
            <button
              onClick={() => cambiarMes(1)}
              className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Grid días de semana */}
        <div className="grid grid-cols-7 gap-1 mb-2 text-center">
          {diasSemana.map((dia) => (
            <div
              key={dia}
              className="py-1.5 text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider"
            >
              {dia}
            </div>
          ))}
        </div>

        {/* Grid días del mes */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Espacios vacíos antes del primer día */}
          {Array.from({ length: primerDiaMes }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="min-h-[52px] sm:min-h-[85px] p-1 rounded-xl bg-slate-50/20 dark:bg-slate-800/10 border border-transparent opacity-30"
            />
          ))}

          {/* Días del mes */}
          {Array.from({ length: diasEnMes }).map((_, i) => {
            const dia = i + 1
            const fechaDiaStr = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
            const esHoy = fechaDiaStr === hoyStr
            const esSeleccionado = fechaDiaStr === diaSelStr

            // Citas en este día exacto
            const citasDelDia = citas.filter((c) => (c.fecha_inicio || '').slice(0, 10) === fechaDiaStr)
            const tieneCitas = citasDelDia.length > 0

            return (
              <div
                key={dia}
                onClick={() => setDiaSelStr(fechaDiaStr)}
                className={[
                  'min-h-[52px] sm:min-h-[85px] p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border flex flex-col justify-between transition-all cursor-pointer select-none active:scale-95',
                  esSeleccionado
                    ? 'ring-2 ring-primary-500 bg-primary-50/50 dark:bg-primary-950/40 border-primary-400 shadow-sm'
                    : esHoy
                    ? 'bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60'
                    : 'bg-white dark:bg-slate-800/60 border-slate-100 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={[
                      'text-xs sm:text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors',
                      esHoy
                        ? 'bg-primary-600 text-white shadow-sm font-black'
                        : esSeleccionado
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black'
                        : 'text-slate-700 dark:text-slate-300',
                    ].join(' ')}
                  >
                    {dia}
                  </span>

                  {tieneCitas && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300">
                      {citasDelDia.length}
                    </span>
                  )}
                </div>

                {/* Puntos / Indicadores de referencia visual de citas */}
                <div className="mt-1">
                  {tieneCitas ? (
                    <div className="flex items-center justify-center sm:justify-start gap-1">
                      {citasDelDia.slice(0, 3).map((c, idx) => (
                        <span
                          key={c.id || idx}
                          className="w-2 h-2 rounded-full shadow-xs shrink-0"
                          style={{
                            backgroundColor:
                              c.servicio?.color || (c.estado === 'confirmada' ? '#10b981' : '#6366f1'),
                          }}
                          title={`${c.servicio?.nombre || 'Cita'} (${c.fecha_inicio.slice(11, 16)})`}
                        />
                      ))}
                      {citasDelDia.length > 3 && (
                        <span className="text-[9px] font-bold text-slate-400 hidden sm:inline">
                          +{citasDelDia.length - 3}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="h-2" />
                  )}
                </div>

                {/* Resumen de texto solo visible en pantallas grandes */}
                {tieneCitas && (
                  <div className="hidden sm:block mt-1 space-y-0.5 overflow-hidden">
                    {citasDelDia.slice(0, 2).map((c) => (
                      <p
                        key={c.id}
                        className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 truncate leading-tight"
                      >
                        {c.fecha_inicio.slice(11, 16)} {c.servicio?.nombre || 'Cita'}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Lista detallada de citas del día seleccionado */}
      <div className="card p-5 sm:p-6 border border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 capitalize flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-500" />
              {fechaDiaSelFormateada}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {citasDelDiaSeleccionado.length === 0
                ? 'No hay citas agendadas para esta fecha'
                : `${citasDelDiaSeleccionado.length} ${
                    citasDelDiaSeleccionado.length === 1 ? 'cita programada' : 'citas programadas'
                  }`}
            </p>
          </div>

          <Link to="/citas/nueva">
            <Button size="sm" variant="secondary" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Agendar en este día
            </Button>
          </Link>
        </div>

        {citasDelDiaSeleccionado.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            <p className="mb-2">Día libre o sin reservas todavía.</p>
            <p className="text-[11px] text-slate-500">
              Selecciona otro día en el calendario o haz clic en &quot;Agendar en este día&quot;.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {citasDelDiaSeleccionado.map((cita) => (
              <div
                key={cita.id}
                onClick={() => onSeleccionarCita?.(cita)}
                className="py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex flex-col items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/40">
                    <Clock className="w-3.5 h-3.5 mb-0.5" />
                    <span>{cita.fecha_inicio.slice(11, 16)}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {cita.servicio?.nombre || 'Servicio General'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {cita.cliente?.nombre || 'Cliente'}
                      </span>
                      {cita.cliente?.telefono && (
                        <span>• {cita.cliente.telefono}</span>
                      )}
                      <span>• con {cita.empleado?.nombre || 'Especialista'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pl-14 sm:pl-0">
                  <Badge
                    variant={
                      cita.estado === 'confirmada'
                        ? 'success'
                        : cita.estado === 'completada'
                        ? 'primary'
                        : cita.estado === 'cancelada'
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {cita.estado}
                  </Badge>

                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    ${cita.precio_total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
