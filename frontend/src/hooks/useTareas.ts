import { useState, useEffect } from 'react'
import { getTareasByObra, 
  createTarea, 
  updateTarea, 
  deleteTarea, 
  bulkUpdateOrder, 
  cambiarEstadoTarea, 
  crearDetalleMaterial, 
  crearManoDeObra,
  editarDetalleMaterial,
  editarManoDeObra,
  eliminarManoDeObra,
  eliminarDetalleMaterial,
  agregarDependencia,
  eliminarDependencia,
  getAlertasFin,
  confirmarAlertaFin
 } from '@/api/tareas'
import type { Tarea, EstadoTarea } from '@/types'
import type { CreateDetalleMaterialInput, CreateManoDeObraInput, CreateTareaInput, UpdateTareaInput } from '@/types/inputs'

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

async function crear(
  data: CreateTareaInput
): Promise<Tarea> {
  if (creating) {
    throw new Error('Creación de tarea en curso')
  }

  setCreating(true)
  setError(null)

  try {
    const nueva = await createTarea(data)
    setTareas(prev => [...prev, nueva])
    console.log('Tarea creada:', nueva)
    return nueva
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

    setTareas(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,          // conserva detallesMaterial
              ...actualizada // actualiza campos editados
            }
          : t
      )
    )
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
      return actualizada
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message)
        setError(e.message)
      } else {
        setError('Error al cambiar el estado de la tarea')
      }
      throw e
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

async function agregarManoDeObra(
  tareaId: number,
  data: CreateManoDeObraInput
) {
  const nueva = await crearManoDeObra(
    tareaId,
    data
  )

  setTareas(prev =>
    prev.map(t =>
      t.id === tareaId
        ? {
            ...t,
            manoDeObra: [
              ...(t.manoDeObra ?? []),
              nueva,
            ],
          }
        : t
    )
  )

  return nueva
}

async function editarMaterial(
  tareaId: number,
  detalleId: number,
  data: CreateDetalleMaterialInput
) {
  const actualizado =
    await editarDetalleMaterial(
      tareaId,
      detalleId,
      data
    )

setTareas(prev =>
  prev.map(t =>
    t.id === tareaId
      ? {
          ...t,
          detallesMaterial: t.detallesMaterial?.map(d =>
            d.id === detalleId
              ? { ...d, ...actualizado }  // d como base, actualizado encima
              : d
          )
        }
      : t
  )
)

  return actualizado
}
  
async function editarMdo(
  tareaId: number,
  manoDeObraId: number,
  data: CreateManoDeObraInput
) {
  const actualizada = await editarManoDeObra(tareaId, manoDeObraId, data)

  setTareas(prev =>
    prev.map(t =>
      t.id === tareaId
        ? {
            ...t,
            manoDeObra: t.manoDeObra?.map(m =>
              m.id === manoDeObraId
                ? { ...m, ...actualizada }
                : m
            )
          }
        : t
    )
  )

  return actualizada
}

async function eliminarMdo(tareaId: number, manoDeObraId: number) {
  await eliminarManoDeObra(tareaId, manoDeObraId)
  setTareas(prev =>
    prev.map(t =>
      t.id === tareaId
        ? { ...t, manoDeObra: t.manoDeObra?.filter(m => m.id !== manoDeObraId) }
        : t
    )
  )
}

async function borrarDetalleMaterial(tareaId: number, detalleId: number) {
  await eliminarDetalleMaterial(tareaId, detalleId)
  setTareas(prev =>
    prev.map(t =>
      t.id === tareaId
        ? { ...t, detallesMaterial: t.detallesMaterial?.filter(d => d.id !== detalleId) }
        : t
    )
  )
}

async function crearDependencia(bloqueadoraId: number, dependienteId: number) {
  // Optimistic: ID temporal
  const tempId = -Date.now()
  setTareas(prev =>
    prev.map(t =>
      t.id === dependienteId
        ? { ...t, bloqueadaPor: [...(t.bloqueadaPor ?? []), { id: tempId, bloqueadoraId, dependienteId }] }
        : t
    )
  )
  
  try {
    const dependencia = await agregarDependencia(bloqueadoraId, dependienteId)
    // Reemplazá el temp con el real
    setTareas(prev =>
      prev.map(t =>
        t.id === dependienteId
          ? { ...t, bloqueadaPor: t.bloqueadaPor!.map(d => d.id === tempId ? dependencia : d) }
          : t
      )
    )
    return dependencia
  } catch (e) {
    // Rollback
    setTareas(prev =>
      prev.map(t =>
        t.id === dependienteId
          ? { ...t, bloqueadaPor: t.bloqueadaPor!.filter(d => d.id !== tempId) }
          : t
      )
    )
    throw e
  }
}

function limpiarError() {
  setError(null)
}

async function obtenerAlertasFin() {
  return getAlertasFin(obraId)
}

async function responderAlertaFin(tareaId: number, termino: boolean) {
  if (actionLoading) return
  setActionLoading(true)
  setError(null)
  try {
    const actualizada = await confirmarAlertaFin(tareaId, termino)
    setTareas(prev => prev.map(t => t.id === tareaId ? actualizada : t))
    return actualizada
  } catch (e) {
    setError('Error al confirmar la tarea')
    throw e
  } finally {
    setActionLoading(false)
  }
}

  return { tareas, loading, actionLoading, error, limpiarError, creating, updating, crear, editar, eliminar, reordenar, cambiarEstado, agregarMaterial, agregarManoDeObra, editarMaterial, editarMdo, borrarDetalleMaterial, eliminarMdo, crearDependencia, obtenerAlertasFin, responderAlertaFin }
}