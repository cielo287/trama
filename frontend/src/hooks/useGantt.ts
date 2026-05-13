import { useState, useMemo } from 'react'
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  differenceInDays, 
  addDays 
} from 'date-fns'
import { arrayMove } from '@dnd-kit/sortable'
import type { Tarea } from '../types'

interface UseGanttProps {
  tareas: Tarea[]
  onUpdateTareas: (nuevasTareas: Tarea[]) => void
}

export function useGantt({ tareas, onUpdateTareas }: UseGanttProps) {
  const [fecha, setFecha] = useState(new Date())

  const config = {
    minColWidth: 40,
    rowHeight: 48,
    colTarea: 220,
    colEncargado: 160
  }

  const start = startOfMonth(fecha)
  const end = endOfMonth(fecha)
  const dias = useMemo(() => eachDayOfInterval({ start, end }), [start, end])
  const totalDays = dias.length

  const tareasConFecha = useMemo(() => tareas.filter(t => t.fechaInicio), [tareas])
  const tareasSinFecha = useMemo(() => tareas.filter(t => !t.fechaInicio), [tareas])

  const navegarMes = (direccion: 'prev' | 'next') => {
    setFecha(f => new Date(f.getFullYear(), f.getMonth() + (direccion === 'next' ? 1 : -1), 1))
  }

  const parseFecha = (fechaStr: string) => {
    const [y, m, d] = fechaStr.slice(0, 10).split('-').map(Number)
    return new Date(y, m - 1, d)
  }

  const getBarProps = (tarea: Tarea) => {
    if (!tarea.fechaInicio) return null
    
    const inicio = parseFecha(tarea.fechaInicio)
    const fin = tarea.fechaFin ? parseFecha(tarea.fechaFin) : addDays(inicio, 1)

    if (fin < start || inicio > end) return null

    const clampedInicio = inicio < start ? start : inicio
    const clampedFin = fin > end ? end : fin
    const daysBefore = differenceInDays(clampedInicio, start)
    const duration = differenceInDays(clampedFin, clampedInicio) + 1

    return { 
      left: (daysBefore / totalDays) * 100, 
      width: (duration / totalDays) * 100 
    }
  }

  const reordenarTareas = (activeId: string, overId: string) => {
    const oldIndex = tareas.findIndex(t => String(t.id) === activeId)
    const newIndex = tareas.findIndex(t => String(t.id) === overId)
    if (oldIndex !== -1 && newIndex !== -1) {
      onUpdateTareas(arrayMove(tareas, oldIndex, newIndex))
    }
  }

  const redimensionarTarea = (tarea: Tarea, deltaX: number, edge: 'start' | 'end') => {
    const deltaDays = Math.round(deltaX / config.minColWidth)
    if (deltaDays === 0) return

    const inicio = parseFecha(tarea.fechaInicio!)
    const fin = tarea.fechaFin ? parseFecha(tarea.fechaFin) : addDays(inicio, 1)

    let nuevaI = inicio
    let nuevaF = fin

    if (edge === 'start') {
      nuevaI = addDays(nuevaI, deltaDays)
      if (nuevaI > nuevaF) nuevaI = nuevaF
    } else {
      nuevaF = addDays(nuevaF, deltaDays)
      if (nuevaF < nuevaI) nuevaF = nuevaI
    }

    onUpdateTareas(tareas.map(t => t.id === tarea.id 
      ? { ...t, fechaInicio: format(nuevaI, 'yyyy-MM-dd'), fechaFin: format(nuevaF, 'yyyy-MM-dd') } 
      : t
    ))
  }

  const desplazarTarea = (tarea: Tarea, deltaX: number) => {
    const deltaDays = Math.round(deltaX / config.minColWidth)
    if (deltaDays === 0) return

    const inicio = parseFecha(tarea.fechaInicio!)
    const fin = tarea.fechaFin ? parseFecha(tarea.fechaFin) : addDays(inicio, 1)

    onUpdateTareas(tareas.map(t => t.id === tarea.id 
      ? { 
          ...t, 
          fechaInicio: format(addDays(inicio, deltaDays), 'yyyy-MM-dd'), 
          fechaFin: format(addDays(fin, deltaDays), 'yyyy-MM-dd') 
        } 
      : t
    ))
  }

  const asignarFechaClick = (tarea: Tarea, dayIndex: number) => {
    if (tarea.fechaInicio) return
    const selectedDay = dias[dayIndex]
    onUpdateTareas(tareas.map(t => t.id === tarea.id 
      ? { ...t, fechaInicio: format(selectedDay, 'yyyy-MM-dd'), fechaFin: format(addDays(selectedDay, 2), 'yyyy-MM-dd') }
      : t
    ))
  }

  return {
    fecha,
    dias,
    totalDays,
    tareasConFecha,
    tareasSinFecha,
    config,
    navegarMes,
    getBarProps,
    reordenarTareas,
    redimensionarTarea,
    desplazarTarea,
    asignarFechaClick
  }
}