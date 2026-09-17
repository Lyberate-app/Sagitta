import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { AppProvider } from '@/context/AppContext'
import { ConfiguracionProvider } from '@/context/ConfiguracionContext'
import { PageWrapper } from '@/components/layout'
import { Loader } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import CitasPage from '@/pages/CitasPage'
import NuevaCitaPage from '@/pages/NuevaCitaPage'
import ServiciosPage from '@/pages/ServiciosPage'
import EmpleadosPage from '@/pages/EmpleadosPage'
import ClientesPage from '@/pages/ClientesPage'
import PagosPage from '@/pages/PagosPage'
import IntegracionesPage from '@/pages/IntegracionesPage'
import ConfiguracionPage from '@/pages/ConfiguracionPage'
import NotFoundPage from '@/pages/NotFoundPage'

// ─── Guard de rutas privadas ───────────────────────────────────────────────
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <Loader fullScreen text="Cargando..." />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <PageWrapper>{children}</PageWrapper>
}

// ─── Rutas ─────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/citas"
        element={
          <PrivateRoute>
            <CitasPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/citas/nueva"
        element={
          <PrivateRoute>
            <NuevaCitaPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/servicios"
        element={
          <PrivateRoute>
            <ServiciosPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/empleados"
        element={
          <PrivateRoute>
            <EmpleadosPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/clientes"
        element={
          <PrivateRoute>
            <ClientesPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/finanzas"
        element={
          <PrivateRoute>
            <PagosPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/integraciones"
        element={
          <PrivateRoute>
            <IntegracionesPage />
          </PrivateRoute>
        }
      />

      {/* Fase 5: Configuración y Marca Blanca */}
      <Route
        path="/ajustes"
        element={
          <PrivateRoute>
            <ConfiguracionPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

// ─── App raíz ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ConfiguracionProvider>
      <AppProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </AppProvider>
    </ConfiguracionProvider>
  )
}
