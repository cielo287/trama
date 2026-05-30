import { useState, useEffect } from 'react'
import { getTareasByObra, createTarea, updateTarea, deleteTarea, bulkUpdateOrder, cambiarEstadoTarea, crearDetalleMaterial } from '@/api/tareas'
import type { Tarea, EstadoTarea } from '@/types'
import type { CreateDetalleMaterialInput, CreateTareaInput, UpdateTareaInput } from '@/types/inputs'

export function useTareas(obraId: number) {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getTareasByObra(obraId)
      .then(setTareas)
      .catch(() => setError('Error al cargar tareas'))
      .finally(() => setLoading(false))
  }, [obraId])

  async function crear(data: CreateTareaInput) {
    if (creating) return
    setCreating(true)
    setError(null)
    try {
      const nueva = await createTarea(data)
      setTareas(prev => [...prev, nueva])
    } catch (e) {
      console.error(e)
      setError('Error al crear la tarea')
      throw e
    } finally {
      setCreating(false)
    }
  }

  async function editar(id: number, data: UpdateTareaInput) {
    if (updating) return
    setUpdating(true)
    setError(null)
    try {
      const actualizada = await updateTarea(id, data)
      setTareas(prev => prev.map(t => t.id === id ? actualizada : t))
    } catch (e) {
      console.error(e)
      setError('Error al editar la tarea')
      throw e
    } finally {
      setUpdating(false)
    }
  }

  async function cambiarEstado(id: number, nuevoEstado: EstadoTarea, notas?: string) {
    if (actionLoading) return
    setActionLoading(true)
    setError(null)
    try {
      const actualizada = await cambiarEstadoTarea(id, nuevoEstado, notas)
      setTareas(prev => prev.map(t => t.id === id ? actualizada : t))
    } catch {
      setError('Error al cambiar el estado de la tarea')
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


  async function reordenar(nuevasTareas: Tarea[]) {
    setTareas(nuevasTareas)
    
    // Persist to backend
    const payload = nuevasTareas.map((t, index) => ({
      id: t.id,
      orden: index
    }))
    
    try {
      await bulkUpdateOrder(payload)
    } catch (err) {
      console.error('Error persisting order:', err)
      setError('Error al guardar el nuevo orden')

    }
  }

  async function agregarMaterial(
  tareaId: number,
  data: CreateDetalleMaterialInput
) {
  console.log('agregarMaterial', tareaId, data)
  
  const nuevoDetalle = await crearDetalleMaterial(
    tareaId,
    data
  )

  console.log('respuesta backend', nuevoDetalle)

  setTareas(prev =>
    prev.map(t =>
      t.id === tareaId
        ? {
            ...t,
            detallesMaterial: [
              ...(t.detallesMaterial ?? []),
              nuevoDetalle,
            ],
          }
        : t
    )
  )

  return nuevoDetalle
}


  

  return { tareas, loading, actionLoading, error, creating,  updating, crear, editar, eliminar, reordenar, cambiarEstado, agregarMaterial }
}