import { apiFetch } from './client'
import type { Obra } from '@/types'
import type { CreateObraInput } from '@/types/inputs'

const BASE = '/api/obras'

export const getObras = () =>
  apiFetch<Obra[]>(BASE)

export const getObra = (id: number) =>
  apiFetch<Obra>(`${BASE}/${id}`)

export const createObra = (data: CreateObraInput) =>
  apiFetch<Obra>(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

export const updateObra = (
  id: number,
  data: CreateObraInput
) =>
  apiFetch<Obra>(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

export const deleteObra = (id: number) =>
  apiFetch<void>(`${BASE}/${id}`, { method: 'DELETE' })