import { useState, useEffect } from 'react'
import { Plus, Mail, Calendar, Clock, Trash2, Edit2 } from 'lucide-react'
import { Empleado } from '@/types'
import { empleadosService } from '@/services/empleados.service'
import { Button, Avatar, Badge, Loader, Modal, Input, EmptyState } from '@/components/ui'
import { useToast } from '@/hooks/useToast'

const DIAS_NOMBRES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [cargando, setCargando] = useState(true)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Empleado | null>(null)
  const [modalFormAbierto, setModalFormAbierto] = useState(false)
  const [editandoId, setEditandoId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    especialidad: '',
    bio: '',
    activo: true,
  })

  const { toast } = useToast()

  const cargarEmpleados = () => {
    setCargando(true)
    empleadosService
      .getAll()
      .then((res) => {
        if (res.data) setEmpleados(res.data)
      })
      .catch((err) => {
        toast.error('Error al cargar empleados', err instanceof Error ? err.message : 'Error')
      })
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargarEmpleados()
  }, [])

  const handleAbrirNuevo = () => {
    setEditandoId(null)
    setFormData({
      nombre: '',
      email: '',
      especialidad: 'Barbero Master / Estilista',
      bio: '',
      activo: true,
    })
    setModalFormAbierto(true)
  }

  const handleAbrirEditar = (emp: Empleado) => {
    setEditandoId(emp.id)
    setFormData({
      nombre: emp.nombre,
      email: emp.email,
      especialidad: emp.especialidad ?? '',
      bio: emp.bio ?? '',
      activo: emp.activo,
    })
    setModalFormAbierto(true)
  }

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nombre.trim() || !formData.email.trim()) {
      toast.warning('Campos incompletos', 'Nombre y correo son obligatorios')
      return
    }

    try {
      if (editandoId) {
        await empleadosService.update(editandoId, formData)
        toast.success('Profesional actualizado', 'Los datos se guardaron correctamente')
      } else {
        await empleadosService.create(formData)
        toast.success('Profesional registrado', 'El miembro del equipo ha sido añadido')
      }
      setModalFormAbierto(false)
      cargarEmpleados()
    } catch (err) {
      toast.error('Error al guardar', err instanceof Error ? err.message : 'Error')
    }
  }

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Deseas retirar a este profesional del equipo?')) return
    try {
      await empleadosService.delete(id)
      toast.success('Profesional eliminado', 'Se actualizó el directorio del equipo')
      cargarEmpleados()
    } catch (err) {
      toast.error('Error', err instanceof Error ? err.message : 'No se pudo eliminar')
    }
  }

  const handleToggleActivo = async (emp: Empleado) => {
    try {
      await empleadosService.update(emp.id, { activo: !emp.activo })
      toast.info(
        emp.activo ? 'Profesional pausado' : 'Profesional activado',
        `${emp.nombre} ahora está ${!emp.activo ? 'activo para reservas' : 'inactivo'}`
      )
      cargarEmpleados()
    } catch {
      toast.error('Error', 'No se pudo cambiar el estado')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Equipo y Profesionales
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Gestiona tu personal, asigna especialidades y administra sus horarios laborales
          </p>
        </div>

        <Button onClick={handleAbrirNuevo} leftIcon={<Plus className="w-4 h-4" />}>
          Nuevo Profesional
        </Button>
      </div>

      {/* Grid de Empleados */}
      {cargando ? (
        <Loader text="Cargando profesionales..." />
      ) : empleados.length === 0 ? (
        <EmptyState
          title="No hay empleados registrados"
          description="Añade miembros al equipo para asignarles servicios y horarios."
          actionLabel="Añadir Profesional"
          onAction={handleAbrirNuevo}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {empleados.map((emp) => (
            <div
              key={emp.id}
              className="card p-6 flex flex-col justify-between border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={emp.nombre} src={emp.foto} size="lg" />
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                        {emp.nombre}
                      </h4>
                      <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold">
                        {emp.especialidad ?? 'Especialista'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleActivo(emp)}
                    title={emp.activo ? 'Pausar disponibilidad' : 'Activar disponibilidad'}
                  >
                    <Badge variant={emp.activo ? 'success' : 'default'} dot>
                      {emp.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </button>
                </div>

                {emp.bio && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-4">
                    {emp.bio}
                  </p>
                )}

                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {emp.horarios?.length ?? 5} días activos
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEmpleadoSeleccionado(emp)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Ver Horarios"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleAbrirEditar(emp)}
                    className="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/40 transition-colors"
                    title="Editar Profesional"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleEliminar(emp.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Formulario Nuevo / Editar Profesional */}
      {modalFormAbierto && (
        <Modal
          isOpen={true}
          onClose={() => setModalFormAbierto(false)}
          title={editandoId ? 'Editar Profesional' : 'Nuevo Miembro del Equipo'}
        >
          <form onSubmit={handleGuardar} className="space-y-4">
            <Input
              label="Nombre y Apellidos *"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej. Roberto Sánchez"
              required
            />

            <Input
              label="Correo Electrónico *"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="roberto@tunegocio.com"
              required
            />

            <Input
              label="Especialidad / Cargo"
              value={formData.especialidad}
              onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
              placeholder="Ej. Barbero Master, Estilista, Terapeuta Spa"
            />

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Biografía / Reseña Profesional
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Breve resumen de experiencia que verán los clientes al agendar..."
                rows={3}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="activo"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="activo" className="text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                Disponible para reservas de clientes en la página web
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="secondary" type="button" onClick={() => setModalFormAbierto(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editandoId ? 'Guardar Cambios' : 'Registrar Profesional'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Horarios del Empleado */}
      {empleadoSeleccionado && (
        <Modal
          isOpen={true}
          onClose={() => setEmpleadoSeleccionado(null)}
          title={`Horario de ${empleadoSeleccionado.nombre}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Calendar className="w-4 h-4 text-primary-500" />
              <span>Jornada laboral habitual por día de la semana:</span>
            </div>

            <div className="space-y-2">
              {empleadoSeleccionado.horarios && empleadoSeleccionado.horarios.length > 0 ? (
                empleadoSeleccionado.horarios.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs font-medium"
                  >
                    <span className="font-bold text-slate-700 dark:text-slate-300 w-16">
                      {DIAS_NOMBRES[h.dia_semana]}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {h.hora_inicio} — {h.hora_fin}
                    </span>
                    <Badge variant={h.activo ? 'success' : 'default'} size="sm">
                      {h.activo ? 'Disponible' : 'Libre'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Horario estándar de lunes a sábado: 09:00 a 19:00
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setEmpleadoSeleccionado(null)}>Cerrar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
