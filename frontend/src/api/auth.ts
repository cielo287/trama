import { apiFetch } from './client'
import type { Usuario } from '@/types'

const BASE = '/api/auth'

export const login = (email: string, password: string) =>
  apiFetch<void>(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

export async function logout(): Promise<void> {
  await fetch(`${BASE}/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}

export const refresh = () =>
  apiFetch<void>(`${BASE}/refresh`, { method: 'POST' })

export const me = () =>
  apiFetch<Usuario>(`${BASE}/me`)