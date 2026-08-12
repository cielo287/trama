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
import { fechaRealFin, fechaRealInicio } from '@/utils/tarea'
import { parseFechaCalendario as parseFecha } from '@/utils/fecha'


interface UseGanttProps {
  tareas: Tarea[]
  fecha: Date
  onFechaChange: (nuevaFecha: Date) => void
  onUpdateTareas: (nuevasTareas: Tarea[]) => void
}

export function useGantt({ tareas, onUpdateTareas, fecha, onFechaChange }: UseGanttProps) {
  

  const config = {
    minColWidth: 40,
    rowHeight: 56,
    colTarea: 300,
    colEncargado: 160
  }

  const start = startOfMonth(fecha)
  const end = endOfMonth(fecha)
  const dias = useMemo(() => eachDayOfInterval({ start, end }), [start, end])
  const totalDays = dias.length




const tareasConFecha = useMemo(() => {
  return tareas.filter(t => {
    if (!t.fechaInicio) return false

    const inicioReal = fechaRealInicio(t)
    const finReal = fechaRealFin(t)

    const inicio = inicioReal ? parseFecha(inicioReal) : parseFecha(t.fechaInicio)

    const fin = finReal
      ? parseFecha(finReal)
      : t.fechaFin
        ? parseFecha(t.fechaFin)
        : inicio

    return (
      inicio <= end &&
      fin >= start
    )
  })
}, [tareas, start, end])

  const tareasSinFecha = useMemo(() => tareas.filter(t => !t.fechaInicio), [tareas])

const navegarMes = (
  direccion: 'prev' | 'next'
) => {
  onFechaChange(
    new Date(
      fecha.getFullYear(),
      fecha.getMonth() +
        (direccion === 'next' ? 1 : -1),
      1
    )
  )
}



const getBarProps = (tarea: Tarea) => {
  if (!tarea.fechaInicio) return null

  const inicioReal = fechaRealInicio(tarea)
  const finReal = fechaRealFin(tarea)

  const inicioPlanificado = parseFecha(tarea.fechaInicio)
  const finPlanificado = tarea.fechaFin ? parseFecha(tarea.fechaFin) : addDays(inicioPlanificado, 1)
  const duracionPlanificada = differenceInDays(finPlanificado, inicioPlanificado)

  const inicio = inicioReal ? parseFecha(inicioReal) : inicioPlanificado
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  // Fin "objetivo" manteniendo la duración planificada, anclado al inicio real
  const finConDuracionOriginal = addDays(inicio, duracionPlanificada)

  const finEfectivo = finReal ? parseFecha(finReal) : finConDuracionOriginal
  const extendida = tarea.estado === 'EN_CURSO' && !finReal && finConDuracionOriginal < hoy
  const fin = extendida ? hoy : finEfectivo

  if (fin < start || inicio > end) return null

  const clampedInicio = inicio < start ? start : inicio
  const clampedFin = fin > end ? end : fin
  const clampedFinPlan = finConDuracionOriginal > end ? end : (finConDuracionOriginal < clampedInicio ? clampedInicio : finConDuracionOriginal)

  const daysBefore = differenceInDays(clampedInicio, start)
  const durationTotal = differenceInDays(clampedFin, clampedInicio) + 1
  const durationPlan = differenceInDays(clampedFinPlan, clampedInicio) + 1

  return {
    left: (daysBefore / totalDays) * 100,
    width: (durationTotal / totalDays) * 100,
    widthPlan: (durationPlan / totalDays) * 100,
    extendida,
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