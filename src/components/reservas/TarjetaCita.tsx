import { Calendar, Clock, User, Phone, MapPin } from 'lucide-react'
import { Cita, EstadoCita } from '@/types'
import { Badge, Button } from '@/components/ui'

interface TarjetaCitaProps {
  cita: Cita
  onVerDetalle?: (cita: Cita) => void
  onCambiarEstado?: (cita: Cita, nuevoEstado: EstadoCita) => void
  onCancelar?: (id: number) => void
}

const estadoBadges: Record<EstadoCita, { variant: 'warning' | 'success' | 'danger' | 'default' | 'info'; label: string }> = {
  pendiente: { variant: 'warning', label: 'Pendiente' },
  confirmada: { variant: 'success', label: 'Confirmada' },
  cancelada: { variant: 'danger', label: 'Cancelada' },
  completada: { variant: 'default', label: 'Completada' },
  no_asistio: { variant: 'danger', label: 'No asistió' },
}

export function TarjetaCita({
  cita,
  onVerDetalle,
  onCambiarEstado,
  onCancelar,
}: TarjetaCitaProps) {
  const badge = estadoBadges[cita.estado] ?? { variant: 'default', label: cita.estado }

  return (
    <div className="card p-5 border hover:border-primary-300 dark:hover:border-primary-800 transition-all space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Badge variant={badge.variant} dot>
            {badge.label}
          </Badge>
          <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 mt-2">
            {cita.servicio?.nombre ?? 'Servicio'}
          </h4>
        </div>
        <span className="text-lg font-black text-slate-900 dark:text-slate-100">
          ${cita.precio_total}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
          <span>{cita.fecha_inicio.slice(0, 10)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
          <span>{cita.fecha_inicio.slice(11, 16)} - {cita.fecha_fin.slice(11, 16)}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
          <span className="truncate">Cliente: {cita.cliente?.nombre}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
          <span className="truncate">Prof.: {cita.empleado?.nombre}</span>
        </div>
        {cita.cliente?.telefono && (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
            <span>{cita.cliente.telefono}</span>
          </div>
        )}
        {cita.ubicacion && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
            <span className="truncate">{cita.ubicacion.nombre}</span>
          </div>
        )}
      </div>

      {cita.notas && (
        <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl italic">
          "{cita.notas}"
        </p>
      )}

      {/* Botones de acción */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {cita.estado === 'pendiente' && onCambiarEstado && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onCambiarEstado(cita, 'confirmada')}
            >
              Confirmar
            </Button>
          )}
          {cita.estado === 'confirmada' && onCambiarEstado && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onCambiarEstado(cita, 'completada')}
            >
              Completar
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onVerDetalle && (
            <Button variant="ghost" size="sm" onClick={() => onVerDetalle(cita)}>
              Ver
            </Button>
          )}
          {cita.estado !== 'cancelada' && onCancelar && (
            <Button variant="danger" size="sm" onClick={() => onCancelar(cita.id)}>
              Cancelar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
