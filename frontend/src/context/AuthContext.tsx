import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginApi, logout as logoutApi, me, register as registerApi, verificarCodigo as verificarCodigoApi, reenviarCodigo as reenviarCodigoApi } from '@/api/auth'
import type { RegisterInput } from '@/types/inputs'
import type { Usuario } from '@/types'

type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; usuario: Usuario }

interface AuthContextType {
  state: AuthState
  actionLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  emailNoVerificado: string | null
  limpiarEmailNoVerificado: () => void
  logout: () => Promise<void>
  register: (data: RegisterInput) => Promise<void>
  verificarCodigo: (email: string, codigo: string) => Promise<void>
  reenviarCodigo: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' })
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailNoVerificado, setEmailNoVerificado] = useState<string | null>(null) 

  useEffect(() => {
    const controller = new AbortController()

    me()
      .then(usuario => {
        if (controller.signal.aborted) return
        setState({ status: 'authenticated', usuario })
      })
      .catch(err => {
        if (controller.signal.aborted) return
        if (err instanceof TypeError) {
          console.error('Error de red al verificar sesión:', err)
        }
        setState({ status: 'unauthenticated' })
      })

    return () => controller.abort()
  }, [])

async function login(email: string, password: string) {
  if (actionLoading) return
  setActionLoading(true)
  setError(null)
  try {
    await loginApi(email, password)
    const usuario = await me()
    setState({ status: 'authenticated', usuario })
  } catch (err: any) {
    if (err.code === 'UNVERIFIED') {
      setEmailNoVerificado(email)
    } else {
      setError('Email o contraseña incorrectos')
    }
  } finally {
    setActionLoading(false)
  }
}

function limpiarEmailNoVerificado() {
  setEmailNoVerificado(null)
}

  async function register(data: RegisterInput) {
    if (actionLoading) return
    setActionLoading(true)
    setError(null)
    try {
      await registerApi(data)
    } catch {
      setError('No se pudo crear la cuenta. Verificá los datos.')
      throw new Error('register failed')
    } finally {
      setActionLoading(false)
    }
  }

  async function logout() {
    try {
      await logoutApi()
    } finally {
      setState({ status: 'unauthenticated' })
    }
  }

  async function verificarCodigo(email: string, codigo: string) {
  if (actionLoading) return
  setActionLoading(true)
  setError(null)
  try {
    await verificarCodigoApi(email, codigo)
  } catch (err: any) {
    setError(err.message || 'Código incorrecto')
    throw new Error('verificacion failed')
  } finally {
    setActionLoading(false)
  }
}

async function reenviarCodigo(email: string) {
  if (actionLoading) return
  setActionLoading(true)
  setError(null)
  try {
    await reenviarCodigoApi(email)
  } catch (err: any) {
    setError(err.message || 'No se pudo reenviar el código')
    throw new Error('reenvio failed')
  } finally {
    setActionLoading(false)
  }
}

  return (
    <AuthContext.Provider value={{ state, actionLoading, error, login, logout, register, verificarCodigo, reenviarCodigo, emailNoVerificado, limpiarEmailNoVerificado }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}