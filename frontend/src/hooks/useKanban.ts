import { useState, useMemo } from 'react'
import {
  DragStartEvent,
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

import {
  type Tarea,
  type EstadoTarea
} from '../types'

import {
  startOfMonth,
  endOfMonth
} from 'date-fns'


const COLUMNAS: EstadoTarea[] = [
  'PENDIENTE',
  'EN_PROCESO',
  'ATRASADA',
  'FINALIZADA'
]

interface UseKanbanProps {
  tareas: Tarea[]
  fecha: Date

  onUpdateTareas: (nuevasTareas: Tarea[]) => void

  onEstadoChange: (
    id: number,
    nuevoEstado: EstadoTarea
  ) => void
}

export function useKanban({
  tareas,
  fecha,
  onUpdateTareas,
  onEstadoChange
}: UseKanbanProps) {

  const [activeTarea, setActiveTarea] =
    useState<Tarea | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }),

    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )
  const inicioMes = startOfMonth(fecha)
const finMes = endOfMonth(fecha)

const tareasFiltradas = useMemo(() => {
  return tareas.filter(t => {

    if (t.estado === 'PENDIENTE') {
      return true
    }

    if (!t.fechaInicio) {
      return true
    }

    const inicio = parseFecha(t.fechaInicio)

    const fin = t.fechaFin
      ? parseFecha(t.fechaFin)
      : inicio

    return (
      inicio <= finMes &&
      fin >= inicioMes
    )
  })
}, [tareas, inicioMes, finMes])

  const tareasPorEstado = useMemo(() => {

    return COLUMNAS.reduce((acc, col) => {
      const tareasColumna = tareasFiltradas.filter(t => t.estado === col)

       if (col === 'PENDIENTE') {
        tareasColumna.sort((a, b) => {
        // Las tareas con fecha van antes que las que no tienen
        if (!a.fechaInicio && !b.fechaInicio) {
          return (a.ordenEjecucion ?? 0) - (b.ordenEjecucion ?? 0)
        }

        if (!a.fechaInicio) return 1
        if (!b.fechaInicio) return -1

        const diff =
          parseFecha(a.fechaInicio).getTime() -
          parseFecha(b.fechaInicio).getTime()

        if (diff !== 0) return diff

        return (a.ordenEjecucion ?? 0) - (b.ordenEjecucion ?? 0)
      })
    } else {
      tareasColumna.sort(
        (a, b) =>
          (a.ordenEjecucion ?? 0) -
          (b.ordenEjecucion ?? 0)
      )
    }

      acc[col] = tareasColumna

      return acc

    }, {} as Record<EstadoTarea, Tarea[]>)

  }, [tareasFiltradas])

  const collisionDetectionStrategy: CollisionDetection = (
    args
  ) => {

    const pointerCollisions = pointerWithin(args)

    if (pointerCollisions.length > 0) {
      return pointerCollisions
    }

    const rectCollisions = rectIntersection(args)

    if (rectCollisions.length > 0) {
      return rectCollisions
    }

    return closestCorners(args)
  }

  function handleDragStart(
    event: DragStartEvent
  ) {

    const { active } = event

    const tarea = tareas.find(
      t => String(t.id) === active.id
    )

    if (tarea) {
      setActiveTarea(tarea)
    }
  }

  

  /**
   * SOLO VISUAL
   * No persistimos ni mutamos estado real acá
   */
  function handleDragOver() {
    return
  }

  async function handleDragEnd(
    event: DragEndEvent
  ) {

    const { active, over } = event

    setActiveTarea(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    const draggedTarea = tareas.find(
      t => String(t.id) === activeId
    )

    if (!draggedTarea) return

    const isOverAColumn =
      COLUMNAS.includes(overId as EstadoTarea)

    const overTarea = tareas.find(
      t => String(t.id) === overId
    )

    const overColumn = isOverAColumn
      ? (overId as EstadoTarea)
      : overTarea?.estado

    if (!overColumn) return

    /**
     * CAMBIO DE COLUMNA
     */
    if (draggedTarea.estado !== overColumn) {

      const nuevasTareas = tareas.map(t =>
        t.id === draggedTarea.id
          ? {
              ...t,
              estado: overColumn
            }
          : t
      )

      /**
       * Update inmediato UI
       */
      onUpdateTareas(nuevasTareas)

      /**
       * Persist backend
       */
      onEstadoChange(
        draggedTarea.id,
        overColumn
      )

      return
    }

    /**
     * REORDER MISMA COLUMNA
     */
    if (
      overTarea &&
      activeId !== overId
    ) {

      const activeIndex =
        tareas.findIndex(
          t => t.id === draggedTarea.id
        )

      const overIndex =
        tareas.findIndex(
          t => t.id === overTarea.id
        )

      const reordered = arrayMove(
        tareas,
        activeIndex,
        overIndex
      )

      onUpdateTareas(reordered)
    }
  }

  function parseFecha(fechaStr: string) {
  const [y, m, d] =
    fechaStr.slice(0, 10)
      .split('-')
      .map(Number)

  return new Date(y, m - 1, d)
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