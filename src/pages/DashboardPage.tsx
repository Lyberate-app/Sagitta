import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Users, Briefcase, TrendingUp, Plus, Clock, ArrowRight, Receipt } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Badge, Button, Loader } from '@/components/ui'
import { Cita } from '@/types'
import { citasService } from '@/services/citas.service'

interface StatCard {
  label: string
  value: string
  change: string
  positive: boolean
  icon: React.ReactNode
  color: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [citas, setCitas] = useState<Cita[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    citasService
      .getAll()
      .then((res) => {
        if (res.data) setCitas(res.data)
      })
      .finally(() => setCargando(false))
  }, [])

  const stats: StatCard[] = [
    { label: 'Citas programadas', value: String(citas.length || 3), change: '+12%', positive: true, icon: <CalendarDays className="w-6 h-6" />, color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/30' },
    { label: 'Clientes activos',  value: '5',                       change: '+5%',  positive: true, icon: <Users        className="w-6 h-6" />, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' },
    { label: 'Profesionales',     value: '3',                       change: '0%',   positive: true, icon: <Briefcase    className="w-6 h-6" />, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30' },
    { label: 'Ingresos mes',      value: '$4,320',                  change: '+18%', positive: true, icon: <TrendingUp   className="w-6 h-6" />, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Hola, {user?.nombre?.split(' ')[0] ?? 'Usuario'} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Aquí tienes el resumen operativo de hoy
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="primary" dot>
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Badge>
          <Link to="/citas/nueva">
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Agendar Cita
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6 border border-slate-100 dark:border-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  stat.positive
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Citas y Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximas Citas */}
        <div className="lg:col-span-2 card p-6 border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Próximas Citas Agendadas
            </h2>
            <Link
              to="/citas"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1"
            >
              Ver agenda completa <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {cargando ? (
            <Loader text="Cargando citas..." />
          ) : citas.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No hay citas programadas para hoy.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {citas.slice(0, 4).map((cita) => (
                <div key={cita.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {cita.fecha_inicio.slice(11, 16)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                        {cita.servicio?.nombre}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {cita.cliente?.nombre} • con {cita.empleado?.nombre}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={cita.estado === 'confirmada' ? 'success' : 'warning'} size="sm">
                      {cita.estado}
                    </Badge>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      ${cita.precio_total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accesos Rápidos */}
        <div className="card p-6 border border-slate-100 dark:border-slate-800 space-y-4">
          <h2 className="font-bold text-base text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
            Accesos Rápidos
          </h2>

          <div className="space-y-2.5">
            <Link
              to="/citas/nueva"
              className="flex items-center justify-between p-3 rounded-xl bg-primary-50/50 dark:bg-primary-950/30 hover:bg-primary-100/60 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Nueva Cita</p>
                  <p className="text-[11px] text-slate-400">Asistente paso a paso</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/servicios"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Catálogo de Servicios</p>
                  <p className="text-[11px] text-slate-400">Precios y duraciones</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/empleados"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Profesionales</p>
                  <p className="text-[11px] text-slate-400">Horarios y especialistas</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/clientes"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Directorio de Clientes</p>
                  <p className="text-[11px] text-slate-400">Historial y contactos</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/finanzas"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Finanzas y Pagos</p>
                  <p className="text-[11px] text-slate-400">Facturación y cupones</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
