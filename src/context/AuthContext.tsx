import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { User, LoginPayload } from '@/types'
import { authService, apiClient } from '@/services/api.client'

// ─── Tipos del contexto ────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
}

// ─── Contexto ─────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// ─── Provider ─────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restaurar sesión al montar
  useEffect(() => {
    const token = apiClient.getToken()
    if (!token) {
      setIsLoading(false)
      return
    }
    authService
      .me()
      .then(setUser)
      .catch(() => apiClient.clearTokens())
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const { user: me } = await authService.login(payload)
    setUser(me)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

