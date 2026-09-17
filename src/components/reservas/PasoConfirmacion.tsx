import { useState } from 'react'
import { Calendar, Clock, User, DollarSign, Repeat, FileText } from 'lucide-react'
import {
  Servicio, DuracionServicio, Empleado, TipoRecurrencia
} from '@/types'
import { Button, Textarea, Select } from '@/components/ui'

interface PasoConfirmacionProps {
  servicio?: Servicio
  duracion?: DuracionServicio
  empleado?: Empleado
  fecha?: string
  hora?: string
  notas: string
  onNotasChange: (notas: string) => void
  onAnterior: () => void
  onConfirmar: (datosExtra: { recurrencia?: { tipo: TipoRecurrencia; intervalo: number } }) => void
  cargando?: boolean
}

export function PasoConfirmacion({
  servicio,
  duracion,
  empleado,
  fecha,
  hora,
  notas,
  onNotasChange,
  onAnterior,
  onConfirmar,
  cargando = false,
}: PasoConfirmacionProps) {
  const [esRecurrente, setEsRecurrente] = useState(false)
  const [tipoRecurrencia, setTipoRecurrencia] = useState<TipoRecurrencia>('semanal')
  const [intervalo, setIntervalo] = useState(1)

  const precioFinal = duracion?.precio ?? servicio?.precio_base ?? 0
  const duracionFinal = duracion?.duracion_min ?? servicio?.duracion_base_min ?? 30

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirmar({
      recurrencia: esRecurrente
        ? { tipo: tipoRecurrencia, intervalo }
        : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Paso 4: Confirmación y notas
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Revisa el resumen antes de agendar tu cita
        </p>
      </div>

      {/* Tarjeta de Resumen */}
      <div className="card p-6 bg-primary-50/20 dark:bg-primary-950/20 border-primary-200 dark:border-primary-900/60 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">
              {servicio?.nombre}
            </h4>
            <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold">
              {duracion?.etiqueta ? `${duracion.etiqueta} • ` : ''}{duracionFinal} minutos
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center justify-end">
              <DollarSign className="w-5 h-5 text-primary-600" />
              {precioFinal}
            </span>
            <span className="text-[11px] text-slate-400">Total a pagar</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <User className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <span>
              Profesional: <strong>{empleado?.nombre}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <span>
              Fecha: <strong>{fecha}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Clock className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <span>
              Horario: <strong>{hora}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <FileText className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <span>Zona horaria: Detectada automáticamente</span>
          </div>
        </div>
      </div>

      {/* Citas Recurrentes */}
      <div className="card p-5 space-y-4">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={esRecurrente}
            onChange={(e) => setEsRecurrente(e.target.checked)}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
          />
          <div className="flex items-center gap-2 font-semibold text-sm text-slate-800 dark:text-slate-200">
            <Repeat className="w-4 h-4 text-primary-500" />
            <span>Programar como cita recurrente</span>
          </div>
        </label>

        {esRecurrente && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 animate-slide-down">
            <Select
              label="Frecuencia"
              value={tipoRecurrencia}
              onChange={(e) => setTipoRecurrencia(e.target.value as TipoRecurrencia)}
              options={[
                { value: 'diaria', label: 'Diaria' },
                { value: 'semanal', label: 'Semanal' },
                { value: 'mensual', label: 'Mensual' },
                { value: 'anual', label: 'Anual' },
              ]}
            />
            <Select
              label="Repetir cada"
              value={intervalo}
              onChange={(e) => setIntervalo(Number(e.target.value))}
              options={[
                { value: 1, label: '1 período' },
                { value: 2, label: '2 períodos' },
                { value: 4, label: '4 períodos' },
              ]}
            />
          </div>
        )}
      </div>

      {/* Notas adicionales */}
      <Textarea
        label="Notas o solicitudes especiales (opcional)"
        placeholder="Escribe aquí cualquier indicación médica, preferencia o detalle importante..."
        value={notas}
        onChange={(e) => onNotasChange(e.target.value)}
        rows={3}
      />

      <div className="flex items-center justify-between pt-4">
        <Button variant="secondary" onClick={onAnterior} disabled={cargando}>
          Atrás
        </Button>
        <Button type="submit" isLoading={cargando} size="lg">
          Confirmar y Agendar Cita
        </Button>
      </div>
    </form>
  )
}
