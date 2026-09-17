import { CalendarDays, Users, Briefcase, TrendingUp } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/ui'

interface StatCard {
  label: string
  value: string
  change: string
  positive: boolean
  icon: React.ReactNode
  color: string
}

const stats: StatCard[] = [
  { label: 'Citas hoy',        value: '24',    change: '+12%', positive: true,  icon: <CalendarDays className="w-6 h-6" />, color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/30' },
  { label: 'Clientes activos', value: '1,248', change: '+5%',  positive: true,  icon: <Users        className="w-6 h-6" />, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' },
  { label: 'Empleados',        value: '8',     change: '0%',   positive: true,  icon: <Briefcase    className="w-6 h-6" />, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30' },
  { label: 'Ingresos mes',     value: '$4,320', change: '-3%', positive: false, icon: <TrendingUp   className="w-6 h-6" />, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30' },
]

import React from 'react'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Hola, {user?.nombre?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Aquí tienes el resumen de hoy
          </p>
        </div>
        <Badge variant="primary" dot>
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6">
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
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Placeholder próximas features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-semibold mb-4">Citas de hoy</h2>
          <div className="flex items-center justify-center h-40 text-slate-400 dark:text-slate-600 text-sm">
            <div className="text-center">
              <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>El calendario de citas llegará en la Fase 2</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Actividad reciente</h2>
          <div className="flex items-center justify-center h-40 text-slate-400 dark:text-slate-600 text-sm">
            <div className="text-center">
              <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>Disponible en Fase 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

