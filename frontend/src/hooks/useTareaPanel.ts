import { useState, useEffect, useCallback } from 'react'
import type { Tarea, EstadoTarea, PrioridadTarea } from '@/types'
import type { CreateTareaInput, UpdateTareaInput } from '@/types/inputs'

interface UseTareaPanelProps {
  tarea?: Tarea | null
  obraId: number
  open: boolean
  onClose: () => void
  onCreate: (data: CreateTareaInput) => Promise<void>
  onUpdate: (id: number, data: UpdateTareaInput) => Promise<void>
  onCambiarEstado?: (id: number, nuevoEstado: EstadoTarea, notas?: string) => Promise<Tarea | void>
}

export function useTareaPanel({
  tarea, obraId, open, onClose, onCreate, onUpdate, onCambiarEstado
}: UseTareaPanelProps) {
  const isNew = !tarea
  const [isEditing, setIsEditing] = useState(isNew)

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [estado, setEstado] = useState<EstadoTarea>('PENDIENTE')
  const [prioridad, setPrioridad] = useState<PrioridadTarea>('ALTA')

  // Sincronizamos el formulario cuando cambia la tarea
  useEffect(() => {
    if (tarea) {
      setTitulo(tarea.titulo)
      setDescripcion(tarea.descripcion ?? '')
      setFechaInicio(tarea.fechaInicio ? tarea.fechaInicio.slice(0, 10) : '')
      setFechaFin(tarea.fechaFin ? tarea.fechaFin.slice(0, 10) : '')
      setEstado(tarea.estado ?? 'PENDIENTE')
      setPrioridad(tarea.prioridad ?? 'ALTA')
      setIsEditing(false)
    } else {
      setTitulo('')
      setDescripcion('')
      setFechaInicio('')
      setFechaFin('')
      setEstado('PENDIENTE')
      setPrioridad('ALTA')
      setIsEditing(true)
    }
  }, [tarea, open])


  const handleSubmit = useCallback(async () => {
    if (!titulo.trim() || !isEditing) return

    if (tarea) {
      if (estado !== tarea.estado && onCambiarEstado) {
        await onCambiarEstado(tarea.id, estado)
      }
      await onUpdate(tarea.id, {
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        fechaInicio: fechaInicio || undefined,
        fechaFin: fechaFin || undefined,
        prioridad,
      })
      setIsEditing(false)
    } else {
      await onCreate({
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        fechaInicio: fechaInicio || undefined,
        fechaFin: fechaFin || undefined,
        prioridad,
        obraId,
      })
      onClose()
    }
  }, [titulo, descripcion, fechaInicio, fechaFin, estado, prioridad, tarea, isEditing, onCambiarEstado, onUpdate, onCreate, obraId, onClose])

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') { onClose(); return }

      const isInput = e.target instanceof HTMLInputElement
        || e.target instanceof HTMLTextAreaElement
        || e.target instanceof HTMLSelectElement

      if (!isInput && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault()
        setIsEditing(true)
      }

      if (e.key === 'Enter' && isEditing && (e.ctrlKey || e.metaKey || !(e.target instanceof HTMLTextAreaElement))) {
        handleSubmit()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose, isEditing, handleSubmit])

  return {
    isNew,
    isEditing,
    setIsEditing,
    titulo, setTitulo,
    descripcion, setDescripcion,
    fechaInicio, setFechaInicio,
    fechaFin, setFechaFin,
    estado, setEstado,
    prioridad, setPrioridad,
    handleSubmit,
  }
}