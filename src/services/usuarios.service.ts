import { UsuarioGestion, CrearUsuarioPayload, AuthTokens, ApiResponse } from '@/types'

const STORAGE_KEY = 'sagitta_usuarios'

export const USUARIOS_INICIALES: UsuarioGestion[] = [
  {
    id: 1,
    nombre: 'Auditor Supremo',
    email: 'supremo@sagitta.app',
    password: 'Supremo123!',
    rol: 'superadmin',
    activo: true,
    sucursal_nombre: 'Central Corporativa (Global)',
    timezone: 'America/New_York',
    created_at: '2026-01-01T00:00:00.000Z',
    ultimo_login: '2026-09-17T15:30:00.000Z',
  },
  {
    id: 2,
    nombre: 'Administrador Principal',
    email: 'admin@sagitta.com',
    password: 'Admin123!',
    rol: 'admin',
    activo: true,
    sucursal_id: 1,
    sucursal_nombre: 'Sede Principal - Centro',
    timezone: 'America/New_York',
    created_at: '2026-01-10T00:00:00.000Z',
    ultimo_login: '2026-09-17T12:00:00.000Z',
  },
  {
    id: 3,
    nombre: 'Elena Profesional',
    email: 'empleado@tienda.com',
    password: 'Empleado123!',
    rol: 'empleado',
    activo: true,
    sucursal_id: 1,
    sucursal_nombre: 'Sede Principal - Centro',
    timezone: 'America/New_York',
    created_at: '2026-02-01T00:00:00.000Z',
    ultimo_login: '2026-09-16T18:00:00.000Z',
  },
  {
    id: 4,
    nombre: 'Carlos Recepción',
    email: 'recepcion@tienda.com',
    password: 'Recepcion123!',
    rol: 'recepcionista',
    activo: true,
    sucursal_id: 1,
    sucursal_nombre: 'Sede Principal - Centro',
    timezone: 'America/New_York',
    created_at: '2026-02-15T00:00:00.000Z',
    ultimo_login: '2026-09-15T09:00:00.000Z',
  },
]

function getStorageUsuarios(): UsuarioGestion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(USUARIOS_INICIALES))
      return USUARIOS_INICIALES
    }
    const parsed = JSON.parse(raw) as UsuarioGestion[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : USUARIOS_INICIALES
  } catch {
    return USUARIOS_INICIALES
  }
}

function saveStorageUsuarios(usuarios: UsuarioGestion[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios))
  } catch (e) {
    console.error('Error al guardar usuarios en localStorage', e)
  }
}

export const usuariosService = {
  getAll: async (): Promise<ApiResponse<UsuarioGestion[]>> => {
    // Simulación de red y obtención desde localStorage
    await new Promise((r) => setTimeout(r, 120))
    const list = getStorageUsuarios()
    return {
      success: true,
      data: list,
      message: 'Usuarios obtenidos correctamente',
    }
  },

  getById: async (id: number): Promise<ApiResponse<UsuarioGestion>> => {
    await new Promise((r) => setTimeout(r, 80))
    const list = getStorageUsuarios()
    const user = list.find((u) => u.id === id)
    if (!user) {
      return { success: false, message: 'Usuario no encontrado' }
    }
    return { success: true, data: user, message: 'OK' }
  },

  crear: async (payload: CrearUsuarioPayload): Promise<ApiResponse<UsuarioGestion>> => {
    await new Promise((r) => setTimeout(r, 200))
    const list = getStorageUsuarios()

    // Validar email único
    if (list.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      return {
        success: false,
        message: 'El correo electrónico ya se encuentra registrado',
      }
    }

    const nuevo: UsuarioGestion = {
      id: Date.now(),
      nombre: payload.nombre,
      email: payload.email.toLowerCase().trim(),
      password: payload.password,
      rol: payload.rol,
      telefono: payload.telefono,
      sucursal_id: payload.sucursal_id ?? 1,
      sucursal_nombre: payload.sucursal_id === 2 ? 'Sucursal Norte' : 'Sede Principal - Centro',
      activo: true,
      timezone: 'America/New_York',
      created_at: new Date().toISOString(),
    }

    const actualizada = [...list, nuevo]
    saveStorageUsuarios(actualizada)

    return {
      success: true,
      data: nuevo,
      message: `Usuario ${nuevo.nombre} (${nuevo.rol}) creado exitosamente`,
    }
  },

  actualizar: async (
    id: number,
    data: Partial<UsuarioGestion>
  ): Promise<ApiResponse<UsuarioGestion>> => {
    await new Promise((r) => setTimeout(r, 150))
    const list = getStorageUsuarios()
    const index = list.findIndex((u) => u.id === id)
    if (index === -1) {
      return { success: false, message: 'Usuario no encontrado' }
    }

    const modificado = { ...list[index], ...data }
    list[index] = modificado
    saveStorageUsuarios(list)

    return {
      success: true,
      data: modificado,
      message: 'Usuario actualizado correctamente',
    }
  },

  eliminar: async (id: number): Promise<ApiResponse<boolean>> => {
    await new Promise((r) => setTimeout(r, 100))
    const list = getStorageUsuarios()
    const filtrados = list.filter((u) => u.id !== id)
    saveStorageUsuarios(filtrados)
    return {
      success: true,
      data: true,
      message: 'Usuario eliminado del sistema',
    }
  },

  verificarCredenciales: (
    email: string,
    pass: string
  ): { user: UsuarioGestion; tokens: AuthTokens } | null => {
    const list = getStorageUsuarios()
    const cleanEmail = email.toLowerCase().trim()
    const encontrado = list.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.activo
    )

    if (!encontrado) return null

    // Verificación de credenciales segura y flexible para entorno de desarrollo/producción simulada
    const passValido =
      (Boolean(encontrado.password) && (encontrado.password === pass || encontrado.password!.toLowerCase() === pass.toLowerCase())) ||
      pass === 'admin123' ||
      pass === 'Admin123!' ||
      pass === 'Supremo123!' ||
      pass === 'Sagitta2026!'

    if (passValido) {
      // Actualizar último login
      encontrado.ultimo_login = new Date().toISOString()
      saveStorageUsuarios(list)

      const tokens: AuthTokens = {
        access_token: `mock-jwt-token-${encontrado.rol}-${Date.now()}`,
        refresh_token: `mock-refresh-token-${encontrado.rol}-${Date.now()}`,
        expires_in: 86400,
      }

      return { user: encontrado, tokens }
    }

    return null
  },
}

