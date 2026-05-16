import { useState, useMemo } from 'react'
import { 
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  pointerWithin,
  rectIntersection,
  type CollisionDetection
} from '@dnd-kit/core'
import { 
  arrayMove, 
  sortableKeyboardCoordinates 
} from '@dnd-kit/sortable'
import { type Tarea, type EstadoTarea } from '../types'

const COLUMNAS: EstadoTarea[] = ['PENDIENTE', 'EN_PROCESO', 'ATRASADA', 'FINALIZADA']

interface UseKanbanProps {
  tareas: Tarea[]
  onUpdateTareas: (nuevasTareas: Tarea[]) => void
  onEstadoChange: (id: number, nuevoEstado: EstadoTarea) => void
}

export function useKanban({ tareas, onUpdateTareas, onEstadoChange }: UseKanbanProps) {
  const [activeTarea, setActiveTarea] = useState<Tarea | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const tareasPorEstado = useMemo(() => {
    return COLUMNAS.reduce((acc, col) => {
      acc[col] = tareas
        .filter(t => t.estado === col)
        .sort((a, b) => (a.ordenEjecucion ?? 0) - (b.ordenEjecucion ?? 0))
      return acc
    }, {} as Record<EstadoTarea, Tarea[]>)
  }, [tareas])

  const collisionDetectionStrategy: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args)
    if (pointerCollisions.length > 0) return pointerCollisions

    const rectCollisions = rectIntersection(args)
    if (rectCollisions.length > 0) return rectCollisions

    return closestCorners(args)
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const tarea = tareas.find(t => String(t.id) === active.id)
    if (tarea) setActiveTarea(tarea)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id
    if (activeId === overId) return

    const activeTarea = tareas.find(t => String(t.id) === activeId)
    if (!activeTarea) return

    const isOverAColumn = COLUMNAS.includes(overId as EstadoTarea)
    const overTarea = tareas.find(t => String(t.id) === overId)
    const overColumn = isOverAColumn ? (overId as EstadoTarea) : overTarea?.estado

    if (overColumn && activeTarea.estado !== overColumn) {
      const nuevasTareas = tareas.map(t => 
        t.id === activeTarea.id ? { ...t, estado: overColumn } : t
      )
      onUpdateTareas(nuevasTareas)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTarea(null)
    if (!over) return

    const activeId = active.id
    const overId = over.id

    const draggedTarea = tareas.find(t => String(t.id) === activeId)
    if (!draggedTarea) return

    const isOverAColumn = COLUMNAS.includes(overId as EstadoTarea)
    const overTarea = tareas.find(t => String(t.id) === overId)
    const overColumn = isOverAColumn ? (overId as EstadoTarea) : overTarea?.estado

    if (overColumn) {
      if (draggedTarea.estado !== overColumn) {
        onEstadoChange(draggedTarea.id, overColumn)
      } else if (overTarea && activeId !== overId) {
        const overIndex = tareas.findIndex(t => t.id === overTarea.id)
        const activeIndex = tareas.findIndex(t => t.id === draggedTarea.id)
        const reordered = arrayMove(tareas, activeIndex, overIndex)
        onUpdateTareas(reordered)
      }
    }
  }

  return {
    columns: COLUMNAS,
    activeTarea,
    sensors,
    tareasPorEstado,
    collisionDetectionStrategy,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  }
}