import { useState, useEffect } from 'react'
import { getTareasByObra, createTarea, updateTarea, deleteTarea } from '@/api/tareas'
import type { Tarea } from '@/types'
import type { CreateTareaInput, UpdateTareaInput } from '@/types/inputs'

export function useTareas(obraId: number) {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getTareasByObra(obraId)
      .then(setTareas)
      .catch(() => setError('Error al cargar tareas'))
      .finally(() => setLoading(false))
  }, [obraId])

  async function crear(data: CreateTareaInput) {
    if (actionLoading) return
    setActionLoading(true)
    setError(null)
    try {
      const nueva = await createTarea(data)
      setTareas(prev => [...prev, nueva])
    } catch {
      setError('Error al crear la tarea')
    } finally {
      setActionLoading(false)
    }
  }

  async function editar(id: number, data: UpdateTareaInput) {
    if (actionLoading) return
    setActionLoading(true)
    setError(null)
    try {
      const actualizada = await updateTarea(id, data)
      setTareas(prev => prev.map(t => t.id === id ? actualizada : t))
    } catch {
      setError('Error al editar la tarea')
    } finally {
      setActionLoading(false)
    }
  }

  async function eliminar(id: number) {
    if (actionLoading) return
    setActionLoading(true)
    setError(null)
    try {
      await deleteTarea(id)
      setTareas(prev => prev.filter(t => t.id !== id))
    } catch {
      setError('Error al eliminar la tarea')
    } finally {
      setActionLoading(false)
    }
  }

  function reordenar(nuevasTareas: Tarea[]) {
    setTareas(nuevasTareas)
  }

  return { tareas, loading, actionLoading, error, crear, editar, eliminar, reordenar }
}