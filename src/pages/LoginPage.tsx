import { useState, FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, CalendarDays } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { Button, Input } from '@/components/ui'

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const { toast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.warning('Campos requeridos', 'Por favor completa todos los campos')
      return
    }
    setIsLoading(true)
    try {
      await login({ email, password })
      toast.success('¡Bienvenido!', 'Has iniciado sesión correctamente')
    } catch (err) {
      toast.error(
        'Error al iniciar sesión',
        err instanceof Error ? err.message : 'Credenciales incorrectas'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md text-center space-y-6">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto">
            <CalendarDays className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold">Sagitta</h1>
          <p className="text-primary-200 text-lg leading-relaxed">
            Sistema de reservas y citas inteligente. Gestiona tu agenda con precisión.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {['Reservas', 'Empleados', 'Analítica'].map((f) => (
              <div key={f} className="bg-white/10 rounded-2xl p-4 text-center">
                <p className="text-sm font-medium">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo móvil */}
          <div className="lg:hidden text-center">
            <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CalendarDays className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Sagitta</h1>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Iniciar sesión</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />
            <Input
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              autoComplete="current-password"
              required
            />

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
              Iniciar sesión
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400">
            ¿Problemas para acceder? Contacta a tu administrador.
          </p>
        </div>
      </div>
    </div>
  )
}

