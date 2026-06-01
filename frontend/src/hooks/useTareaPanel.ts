import { useState, useEffect, useCallback } from 'react'
import type { Tarea, EstadoTarea, PrioridadTarea } from '@/types'
import type { CreateTareaInput, UpdateTareaInput } from '@/types/inputs'
import { useRef } from 'react'


interface UseTareaPanelProps {
  tarea?: Tarea | null
  obraId: number
  open: boolean
  onClose: () => void
  onCreate: (data: CreateTareaInput) => Promise<Tarea>
  onUpdate: (id: number, data: UpdateTareaInput) => Promise<void>
  onCreated?: (tarea: Tarea) => void
  onCambiarEstado?: (id: number, nuevoEstado: EstadoTarea, notas?: string) => Promise<Tarea | void>
  onNext?: () => void
  onPrevious?: () => void 
  abrirEnEdicion: boolean
}

export function useTareaPanel({
  tarea, 
  obraId, 
  open, 
  onClose, 
  onCreate, 
  onUpdate, 
  onCreated,
  onCambiarEstado, 
  onNext, 
  onPrevious,
  abrirEnEdicion
}: UseTareaPanelProps) {
  const isNew = !tarea
  const [isEditing, setIsEditing] = useState(isNew)

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [estado, setEstado] = useState<EstadoTarea>('PENDIENTE')
  const [prioridad, setPrioridad] = useState<PrioridadTarea>('ALTA')


useEffect(() => {
  if (tarea) {
    setTitulo(tarea.titulo)
    setDescripcion(tarea.descripcion ?? '')
    setFechaInicio(tarea.fechaInicio ? tarea.fechaInicio.slice(0, 10) : '')
    setFechaFin(tarea.fechaFin ? tarea.fechaFin.slice(0, 10) : '')
    setEstado(tarea.estado ?? 'PENDIENTE')
    setPrioridad(tarea.prioridad ?? 'ALTA')

    setIsEditing(abrirEnEdicion)
  } else {
    setTitulo('')
    setDescripcion('')
    setFechaInicio('')
    setFechaFin('')
    setEstado('PENDIENTE')
    setPrioridad('ALTA')

    setIsEditing(true)
  }
}, [tarea?.id, open, abrirEnEdicion])

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
      const nuevaTarea = await onCreate({
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        fechaInicio: fechaInicio || undefined,
        fechaFin: fechaFin || undefined,
        prioridad,
        obraId,
      })
      onCreated?.(nuevaTarea)
    }
  }, [titulo, 
    descripcion, 
    fechaInicio, 
    fechaFin, 
    estado, 
    prioridad, 
    tarea, 
    isEditing, 
    onCambiarEstado, 
    onUpdate, 
    onCreate, onCreated, obraId])

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'Escape') { onClose(); return }

      const isInput = e.target instanceof HTMLInputElement
        || e.target instanceof HTMLTextAreaElement
        || e.target instanceof HTMLSelectElement

      // 1. Atajos generales (Modo Lectura / No enfocado en inputs)
      if (!isInput) {
        if ((e.key === 'e' || e.key === 'E')) {
          e.preventDefault()
          setIsEditing(true)
        }
        
        // 💡 Navegación con flechas cuando NO se está editando un input
        if (e.key === 'ArrowRight' && onNext) {
          e.preventDefault()
          onNext()
        }
        if (e.key === 'ArrowLeft' && onPrevious) {
          e.preventDefault()
          onPrevious()
        }

        if (e.key === 'ArrowUp' && onPrevious) {
          e.preventDefault()
          onPrevious()
        }

        if (e.key === 'ArrowDown' && onNext) {
          e.preventDefault()
          onNext()
        }

      }

      // 2. Atajos exclusivos del Modo Edición
      if (e.key === 'Enter' && isEditing && (e.ctrlKey || e.metaKey || !(e.target instanceof HTMLTextAreaElement))) {
        handleSubmit()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // 💡 Añadimos onNext y onPrevious a las dependencias del efecto
  }, [open, onClose, isEditing, handleSubmit, onNext, onPrevious])

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