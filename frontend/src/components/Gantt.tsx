
import { useState, useEffect, useRef } from 'react'
import { 
  format, 
  isToday, 
} from 'date-fns'
import { es } from 'date-fns/locale'
import { type Tarea } from '../types'
import { motion } from 'motion/react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useGantt } from '../hooks/useGantt'
import { useDependencyDrag, type DragState } from '../hooks/useDependencyDrag'

const ESTADO_COLOR: Record<string, string> = {
  PENDIENTE: '#CDC5C5',
  EN_PROCESO: '#16F7E8',
  ATRASADA: '#F99783',
  FINALIZADA: '#84CC16',
}

interface Props {
  tareas: Tarea[]
  fecha: Date
  selectedTareaId?: number | null
  onUpdateTareas: (nuevasTareas: Tarea[]) => void
  onTareaClick: (tarea: Tarea) => void
  onNuevaTarea: () => void
  onFechaChange: (nuevaFecha: Date) => void
  onCrearDependencia: (bloqueadoraId: number, dependienteId: number) => Promise<unknown>
}

export default function Gantt({ 
  tareas, 
  fecha,
  onFechaChange,
  selectedTareaId, 
  onUpdateTareas, 
  onTareaClick, 
  onNuevaTarea,
  onCrearDependencia
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const timelineContainerRef = useRef<HTMLDivElement>(null)

const { drag, startDrag, moveDrag, registerTarget } = useDependencyDrag({
  onConnect: onCrearDependencia,
})

useEffect(() => {
  if (!drag) return
  const handleMove = (e: PointerEvent) => moveDrag(e)
  window.addEventListener('pointermove', handleMove)
  return () => window.removeEventListener('pointermove', handleMove)
}, [drag, moveDrag])



const toRelative = (clientX: number, clientY: number) => {
  const rect = timelineContainerRef.current?.getBoundingClientRect()
  if (!rect) return { x: clientX, y: clientY }
  return {
    x: clientX - rect.left + (timelineContainerRef.current?.scrollLeft ?? 0),
    y: clientY - rect.top + (timelineContainerRef.current?.scrollTop ?? 0),
  }
}

const liveLine = drag ? {
  from: toRelative(drag.startX, drag.startY),
  to: toRelative(drag.currentX, drag.currentY),
} : null


  const {
    //fecha,
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
  } = useGantt({ tareas, onUpdateTareas, fecha, onFechaChange })

  
  
  const mesLabel = format(fecha, 'MMMM yyyy', { locale: es })
    .replace(/^\w/, c => c.toUpperCase())

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return
    reordenarTareas(active.id as string, over.id as string)
  }

  const barRefsMap = useRef<Map<number, HTMLDivElement>>(new Map())
const [, forceUpdate] = useState(0)

useEffect(() => {
  const id = requestAnimationFrame(() => forceUpdate(n => n + 1))
  return () => cancelAnimationFrame(id)
}, [])



const getPersistentLines = () => {
  const containerRect = timelineContainerRef.current?.getBoundingClientRect()
  if (!containerRect) return []
  const lines: { x1: number; y1: number; x2: number; y2: number; id: number }[] = []
  for (const tarea of tareasConFecha) {
    if (!tarea.bloqueadaPor?.length) continue
    const depEl = barRefsMap.current.get(tarea.id)
    if (!depEl) continue
    const depRect = depEl.getBoundingClientRect()
    const depX = depRect.left - containerRect.left + (timelineContainerRef.current?.scrollLeft ?? 0)
    const depY = depRect.top - containerRect.top + (timelineContainerRef.current?.scrollTop ?? 0) + depRect.height / 2
    for (const dep of tarea.bloqueadaPor) {
      const bloqEl = barRefsMap.current.get(dep.bloqueadoraId)
      if (!bloqEl) continue
      const bloqRect = bloqEl.getBoundingClientRect()
      const bloqX = bloqRect.right - containerRect.left + (timelineContainerRef.current?.scrollLeft ?? 0)
      const bloqY = bloqRect.top - containerRect.top + (timelineContainerRef.current?.scrollTop ?? 0) + bloqRect.height / 2
      lines.push({ x1: bloqX, y1: bloqY, x2: depX, y2: depY, id: dep.id })
    }
  }
  return lines
}

  const SortableRow = ({ tarea, ...props }: { tarea: Tarea, [key: string]: any }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: String(tarea.id) })
    const bar = getBarProps(tarea)

    const isSelected = selectedTareaId === tarea.id
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 50 : 'auto',
      opacity: isDragging ? 0.5 : 1,
    }

    const PRIORIDAD_COLOR: Record<string, string> = {
      ALTA: '#EF4444',
      MEDIA: '#F59E0B',
      BAJA: '#84CC16',
    }

    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className = {`flex border-b border-black/[0.04] group transition-colors
          ${isSelected
            ? 'bg-[#A44A3F]/[0.08] border-l-2 border-l-[#A44A3F]'
            : 'hover:bg-gray-50/50'
          }`}
      >
        {/* Columnas Fijas (Sticky) */}
        <div 
          className={`sticky left-0 z-20 flex border-r border-black/[0.08] transition-colors
            ${isSelected ? 'bg-[#fdf8f7]' : 'bg-white group-hover:bg-gray-50'              
            }`}
          style={{ width: config.colTarea + config.colEncargado, height: config.rowHeight }}
        >
          <div {...attributes} {...listeners} className="p-2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-[#A44A3F] transition-colors flex items-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="lucide lucide-grip-vertical"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
          </div>
          
          <div onClick={() => onTareaClick(tarea)} style={{ width: config.colTarea - 28 }} className="px-2 flex items-center gap-2 border-r border-black/[0.06] overflow-hidden cursor-pointer">
            
<div className="flex items-center gap-2 flex-1 min-w-0">
  <span
    className="px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase shrink-0"
    style={{
      backgroundColor:
        tarea.prioridad === 'ALTA'
          ? '#FEE2E2'
          : tarea.prioridad === 'MEDIA'
          ? '#FEF3C7'
          : '#ECFCCB',
      color:
        tarea.prioridad === 'ALTA'
          ? '#EF4444'
          : tarea.prioridad === 'MEDIA'
          ? '#F59E0B'
          : '#84CC16',
    }}
  >
    {tarea.prioridad}
  </span>

  <span
    className={`font-mono text-[14px] truncate flex-1 transition-colors ${
      isSelected
        ? 'text-[#A44A3F] font-bold'
        : 'text-[#333] group-hover:text-[#A44A3F]'
    }`}
  >
    {tarea.titulo}
  </span>
  

</div>
          </div>
          
          <div style={{ width: config.colEncargado }} className="px-4 flex items-center overflow-hidden">
            {tarea.manoDeObra?.[0]?.encargado ? (
              <span className="font-mono text-[13px] text-[#6B7280] truncate">
                {tarea.manoDeObra[0].encargado.nombre.charAt(0)}. {tarea.manoDeObra[0].encargado.apellido}
              </span>
            ) : (
              <span className="font-mono text-[10px] text-[#ccc] uppercase tracking-wider">N/A</span>
            )}
          </div>
        </div>

        {/* Timeline (Scrollable) */}
        <div className="flex-1 relative flex items-center px-[2px] h-[48px]">
          {/* Grid de interacción para asignar fechas */}
          {!bar && (
            <div className="absolute inset-0 flex">
              {dias.map((_, idx) => (
                <div 
                  key={`action-${idx}`}
                  onClick={() => asignarFechaClick(tarea, idx)}
                  style={{ width: `${100 / totalDays}%`, minWidth: config.minColWidth }}
                  className="h-full hover:bg-[#A44A3F]/[0.05] cursor-crosshair transition-colors border-r border-black/[0.01]"
                  title="Click para programar desde este día"
                />
              ))}
            </div>
          )}

          {/* Grid Lines de fondo */}
          <div className="absolute inset-0 pointer-events-none flex">
            {dias.map(dia => (
              <div 
                key={`grid-${dia.toISOString()}`}
                style={{ width: `${100 / totalDays}%`, minWidth: config.minColWidth }}
                className={`border-r last:border-r-0 border-black/[0.02] ${isToday(dia) ? 'bg-[#A44A3F]/[0.02]' : ''}`}
              />
            ))}
          </div>

          {bar && (
            <motion.div 
              drag="x"
              dragMomentum={false}
              dragElastic={0}
              onDragEnd={(_, info) => desplazarTarea(tarea, info.offset.x)}
              style={{ 
                position: 'absolute', 
                left: `${bar.left}%`, 
                width: `${bar.width}%`, 
                height: 14, 
                background: ESTADO_COLOR[tarea.estado ?? 'PENDIENTE'],
                borderRadius: '4px',
                cursor: 'grab',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                overflow: 'visible'
              }}
              animate= {{scaleY: isSelected ? 1.2 : 1 }}
              whileHover={{ scaleY: 1.2, opacity: 1, zIndex: 10 }}
              whileTap={{ cursor: 'grabbing' }}
              initial={{ opacity: 0.85 }}
              onPointerEnter={() => { if (drag) registerTarget(tarea.id) }}
              ref={(el) => {
                if (el) barRefsMap.current.set(tarea.id, el as HTMLDivElement)
                else barRefsMap.current.delete(tarea.id)
              }}
            >
<div
  className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white border border-[#A44A3F] opacity-0 group-hover:opacity-100 transition-opacity cursor-crosshair z-20"
  onPointerDown={(e) => startDrag(e, tarea.id, 'end')}
  title="Bloquea a..."
/>
<div
  className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white border border-[#A44A3F] opacity-0 group-hover:opacity-100 transition-opacity cursor-crosshair z-20"
  onPointerDown={(e) => startDrag(e, tarea.id, 'start')}
  title="Depende de..."
/>
              {/* Manejador izquierdo (Resize) */}
              <motion.div 
                drag="x"
                dragMomentum={false}
                onDragEnd={(_, info) => redimensionarTarea(tarea, info.offset.x, 'start')}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-2 h-full cursor-ew-resize hover:bg-black/20 flex items-center justify-center group/h"
                title="Ajustar inicio"
              >
                <div className="w-[1px] h-2 bg-white/40 group-hover/h:bg-white transition-colors" />
              </motion.div>
              
              {/* Manejador derecho (Resize) */}
              <motion.div 
                drag="x"
                dragMomentum={false}
                onDragEnd={(_, info) => redimensionarTarea(tarea, info.offset.x, 'end')}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-2 h-full cursor-ew-resize hover:bg-black/20 flex items-center justify-center group/h"
                title="Ajustar fin"
              >
                <div className="w-[1px] h-2 bg-white/40 group-hover/h:bg-white transition-colors" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-black/[0.08] rounded-sm flex flex-col h-full font-sans">
      {/* Header estático */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-black/[0.1] bg-white z-50">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-[#A44A3F] animate-pulse" />
          <h2 className="text-[13px] tracking-[0.2em] uppercase font-bold text-[#333] font-sans">
            Planificación: <span className="text-[#A44A3F] font-sans">{mesLabel}</span>
          </h2>
        </div>
        
      </div>

      {/* Area de scroll principal */}
      <div
        ref={timelineContainerRef}
        className="flex-1 overflow-auto relative"
        onScroll={() => forceUpdate(n => n + 1)}
        >
        <div style={{ minWidth: (config.colTarea + config.colEncargado) + (totalDays * config.minColWidth) }}>
          
          {/* Header de la tabla */}
          <div className="sticky top-0 z-40 flex border-b border-black/[0.1] bg-gray-50/80 backdrop-blur-sm">
            <div className="sticky left-0 z-50 flex bg-white border-r border-black/[0.08]" style={{ width: config.colTarea + config.colEncargado, height: config.rowHeight }}>
              <div style={{ width: config.colTarea }} className="px-6 flex items-center text-[10px] tracking-[0.2em] uppercase text-[#6B7280] border-r border-black/[0.06]">Tarea</div>
              <div style={{ width: config.colEncargado }} className="px-4 flex items-center text-[10px] tracking-[0.2em] uppercase text-[#6B7280]">Encargado</div>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              {dias.map(dia => (
                <div 
                  key={`h-${dia.toISOString()}`}
                  style={{ width: `${100 / totalDays}%`, minWidth: config.minColWidth }}
                  className={`flex flex-col items-center justify-center border-r border-black/[0.05] py-2 ${isToday(dia) ? 'bg-[#A44A3F]/[0.05]' : ''}`}
                >
                  <span className={`text-[9px] uppercase leading-none mb-1 ${isToday(dia) ? 'text-[#A44A3F] font-bold' : 'text-[#9CA3AF]'}`}>{format(dia, 'EEE', { locale: es }).slice(0,1)}</span>
                  <span className={`text-[11px] leading-none ${isToday(dia) ? 'text-[#A44A3F] font-bold' : 'text-[#4B5563]'}`}>{format(dia, 'd')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dnd Context */}
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* Tareas Programadas */}
            {tareasConFecha.length > 0 && (
              <>
                <div className="sticky left-0 z-30 bg-[#fefaf9] px-4 py-1.5 border-b border-black/[0.06] text-[9px] uppercase tracking-[0.2em] font-bold text-[#A44A3F]">
                   Tareas Programadas ({tareasConFecha.length})
                </div>
                <SortableContext items={tareasConFecha.map(t => String(t.id))} strategy={verticalListSortingStrategy}>
                  {tareasConFecha.map(tarea => <SortableRow key={tarea.id} tarea={tarea} />)}
                </SortableContext>
              </>
            )}

            {/* Tareas Sin Programar */}
            {tareasSinFecha.length > 0 && (
              <>
                <div className="sticky left-0 z-30 bg-[#f9fbfb] px-4 py-1.5 border-b border-black/[0.06] text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500">
                   Tareas Sin Programar ({tareasSinFecha.length})
                </div>
                <SortableContext items={tareasSinFecha.map(t => String(t.id))} strategy={verticalListSortingStrategy}>
                  {tareasSinFecha.map(tarea => <SortableRow key={tarea.id} tarea={tarea} />)}
                </SortableContext>
              </>
            )}

            <DragOverlay>
              {activeId ? (
                <div className="bg-white shadow-xl border border-[#A44A3F]/20 opacity-90 p-4 rounded-md">
                   <span className="text-[13px] font-bold text-[#A44A3F] font-mono">{tareas.find(t => String(t.id) === activeId)?.titulo}</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
        
{(liveLine || tareasConFecha.some(t => t.bloqueadaPor?.length)) && (
  <svg className="absolute inset-0 pointer-events-none z-50" style={{ width: '100%', height: '100%' }}>
    <defs>
      <marker id="dep-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M0,0 L0,6 L6,3 z" fill="#A44A3F" />
      </marker>
    </defs>
{getPersistentLines().map(line => {
  const midX = (line.x1 + line.x2) / 2
  return (
    <path
      key={line.id}
      d={`M ${line.x1} ${line.y1} H ${midX} V ${line.y2} H ${line.x2}`}
      fill="none"
      stroke="#A44A3F"
      strokeWidth="1.5"
      strokeDasharray="1 4"
      strokeLinecap="round"
      opacity="0.5"
      markerEnd="url(#dep-arrow)"
    />
  )
})}
    {liveLine && (
      <>
        <circle cx={liveLine.from.x} cy={liveLine.from.y} r="3" fill="#A44A3F" opacity="0.9" />
        <line
          x1={liveLine.from.x} y1={liveLine.from.y}
          x2={liveLine.to.x} y2={liveLine.to.y}
          stroke="#A44A3F"
          strokeWidth="2"
          strokeDasharray="5 3"
          opacity="0.75"
          markerEnd="url(#dep-arrow)"
        />
      </>
    )}
  </svg>
)}

      </div>

      {/* Footer */}
      <div className="border-t border-black/[0.05] px-6 py-4 bg-white flex items-center justify-between">
        <button onClick={onNuevaTarea} className="flex items-center gap-3 text-[#A44A3F] hover:text-[#8c3f36] transition-all group">
          <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center group-hover:scale-110">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><line x1="6" y1="2" x2="6" y2="10" /><line x1="2" y1="6" x2="10" y2="6" /></svg>
          </div>
          <span className="text-[12px] tracking-[0.1em] uppercase font-bold">Nueva Tarea</span>
        </button>
        
        <div className="flex gap-6">
          {Object.entries(ESTADO_COLOR).map(([estado, color]) => (
            <div key={estado} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-[9px] uppercase text-gray-400 tracking-widest">{estado}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}