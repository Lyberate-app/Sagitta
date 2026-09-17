import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { AppProvider } from '@/context/AppContext'
import { PageWrapper } from '@/components/layout'
import { Loader } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
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
      {/* Fase 2+ */}
      <Route
        path="/citas"
        element={
          <PrivateRoute>
            <div className="card p-8 text-center text-slate-400">Citas — Fase 2</div>
          </PrivateRoute>
        }
      />
      <Route
        path="/clientes"
        element={
          <PrivateRoute>
            <div className="card p-8 text-center text-slate-400">Clientes — Fase 2</div>
          </PrivateRoute>
        }
      />
      <Route
        path="/empleados"
        element={
          <PrivateRoute>
            <div className="card p-8 text-center text-slate-400">Empleados — Fase 2</div>
          </PrivateRoute>
        }
      />
      <Route
        path="/ajustes"
        element={
          <PrivateRoute>
            <div className="card p-8 text-center text-slate-400">Ajustes — Fase 5</div>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

// ─── App raíz ─────────────────────────────────────────────────────────────
import React from 'react'

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  )
}

