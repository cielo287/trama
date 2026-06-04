import { useState, useEffect } from 'react'
import { getObras, createObra, updateObra, deleteObra } from '@/api/obras'
import type { Obra } from '@/types'
import { CreateObraInput } from '@/types/inputs'

export function useObras() {
  const [obras, setObras] = useState<Obra[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)
    getObras()
      .then(setObras)
      .catch(() => setError('Error al cargar obras'))
      .finally(() => setLoading(false))
  }, [])

async function crear(data: CreateObraInput) {
  if (actionLoading) return

  setActionLoading(true)
  setError(null)

  try {
    const nueva = await createObra(data)
    setObras(prev => [...prev, nueva])
  } catch {
    setError('Error al crear la obra')
  } finally {
    setActionLoading(false)
  }
}

async function editar(
  id: number,
  data: CreateObraInput
) {
  if (actionLoading) return

  setActionLoading(true)
  setError(null)

  try {
    const actualizada = await updateObra(id, data)

    setObras(prev =>
      prev.map(o =>
        o.id === id ? actualizada : o
      )
    )
  } catch {
    setError('Error al editar la obra')
  } finally {
    setActionLoading(false)
  }
}

  async function eliminar(id: number) {
    if (actionLoading) return   
    setActionLoading(true)
    setError(null)
    try {
      await deleteObra(id)
      setObras(prev => prev.filter(o => o.id !== id))
    } catch {
      setError('Error al eliminar la obra')
    } finally {
      setActionLoading(false)
    }
  }

  return { obras, loading, actionLoading, error, crear, editar, eliminar }
}