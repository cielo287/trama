import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginApi, logout as logoutApi, me } from '@/api/auth'
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
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' })
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

useEffect(() => {
  const controller = new AbortController()

  me()
    .then(usuario => {
      if (controller.signal.aborted) return
      setState({ status: 'authenticated', usuario })
    })
    .catch(err => {
      if (controller.signal.aborted) return
      // Error de red vs no autenticado
      if (err instanceof TypeError) {
        // TypeError = sin conexión, backend caído
        console.error('Error de red al verificar sesión:', err)
      }
      // En ambos casos no autenticado — no podemos hacer nada sin sesión
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
    } catch {
      setError('Email o contraseña incorrectos')
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

  return (
    <AuthContext.Provider value={{ state, actionLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}