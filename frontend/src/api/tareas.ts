import { apiFetch } from './client'
import type { Tarea } from '@/types'
import type { CreateTareaInput } from '@/types/inputs'
import type { UpdateTareaInput } from '@/types/inputs'


export const getTareasByObra = (obraId: number) =>
  apiFetch<Tarea[]>(`/api/obras/${obraId}/tareas`)

export const createTarea = (data: CreateTareaInput) =>
  apiFetch<Tarea>('/api/tareas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

export const updateTarea = (id: number, data: UpdateTareaInput) =>
  apiFetch<Tarea>(`/api/tareas/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

export const deleteTarea = (id: number) =>
  apiFetch(`/api/tareas/${id}`, { method: 'DELETE' })
  
export const bulkUpdateOrder = (orden: { id: number; orden: number }[]) =>
  apiFetch<void>('/api/tareas/reorder', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orden }),
  })

export const cambiarEstadoTarea = (id: number, nuevoEstado: string, notas?: string) =>
  apiFetch<Tarea>(`/api/tareas/${id}/cambiar-estado`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nuevoEstado, notas }),
  })