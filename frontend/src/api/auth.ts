import { apiFetch } from './client'
import type { Usuario } from '@/types'
import type { RegisterInput } from '@/types/inputs'

const BASE = '/api/auth'

export const login = (email: string, password: string) =>
  apiFetch<void>(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

export async function logout(): Promise<void> {
  await apiFetch(`${BASE}/logout`, {
    method: 'POST',
  })
}

export const refresh = () =>
  apiFetch<void>(`${BASE}/refresh`, { method: 'POST' })

export const me = () =>
  apiFetch<Usuario>(`${BASE}/me`)

export const register = (input: RegisterInput) =>
  apiFetch<Usuario>(`${BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  export const verificarCodigo = (email: string, codigo: string) =>
  apiFetch<{ message: string }>(`${BASE}/verificar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, codigo }),
  })

export const reenviarCodigo = (email: string) =>
  apiFetch<{ message: string }>(`${BASE}/reenviar-codigo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  export const solicitarRecuperacion = (email: string) =>
  apiFetch<{ message: string }>(`${BASE}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

export const resetearPassword = (token: string, nuevaPassword: string) =>
  apiFetch<{ message: string }>(`${BASE}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, nuevaPassword }),
  })