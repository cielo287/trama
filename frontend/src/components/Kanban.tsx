import { useState, useMemo } from 'react'
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { EstadoTarea, Tarea } from '../types'
import { motion } from 'motion/react'

type Estado = 'PENDIENTE' | 'EN_PROCESO' | 'ATRASADA' | 'FINALIZADA'

const COLUMNAS: Estado[] = ['PENDIENTE', 'EN_PROCESO', 'ATRASADA', 'FINALIZADA']

const ESTADO_LABEL: Record<Estado, string> = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En Proceso',
  ATRASADA: 'Atrasada',
  FINALIZADA: 'Finalizada',
}

const ESTADO_COLOR: Record<Estado, string> = {
  PENDIENTE: '#CDC5C5',
  EN_PROCESO: '#16F7E8',
  ATRASADA: '#F99783',
  FINALIZADA: '#84CC16',
}

interface Props {
  tareas: Tarea[]
  onUpdateTareas: (nuevasTareas: Tarea[]) => void
  onCambiarEstado?: (id: number, nuevoEstado: EstadoTarea, notas?: string) => Promise<Tarea | void>
  onTareaClick: (tarea: Tarea) => void
  onNuevaTarea: () => void
}

export default function Kanban({ tareas, onUpdateTareas, onCambiarEstado, onTareaClick }: Props) {
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
    }, {} as Record<Tarea['estado'], Tarea[]>)
  }, [tareas])

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

    // Find if we are over a column or a task
    const isOverAColumn = COLUMNAS.includes(overId as Tarea['estado'])
    const overTarea = tareas.find(t => String(t.id) === overId)
    
    const overColumn = isOverAColumn ? (overId as Tarea['estado']) : overTarea?.estado

    if (overColumn && activeTarea.estado !== overColumn) {
      const nuevasTareas = [...tareas]
      const index = nuevasTareas.findIndex(t => t.id === activeTarea.id)
      nuevasTareas[index] = { ...activeTarea, estado: overColumn }
      // Trigger update but don't persist yet until drag ends to avoid spamming
      onUpdateTareas(nuevasTareas)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTarea(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    const activeTarea = tareas.find(t => String(t.id) === activeId)
    const overTarea = tareas.find(t => String(t.id) === overId)

    if (!activeTarea) return

    const overColumn = COLUMNAS.includes(overId as Tarea['estado']) 
      ? (overId as Tarea['estado']) 
      : overTarea?.estado

    if (overColumn) {
      const finalTasks = [...tareas]
      const activeIndex = finalTasks.findIndex(t => t.id === activeTarea.id)
      
      if (activeTarea.estado !== overColumn) {
        // Persist status change
        onCambiarEstado?.(activeTarea.id, overColumn)
      } else if (overTarea && activeId !== overId) {
        // Position reorder within same column
        const overIndex = finalTasks.findIndex(t => t.id === overTarea.id)
        const reordered = arrayMove(finalTasks, activeIndex, overIndex)
        onUpdateTareas(reordered)
      }
    }
  }

  return (
    <div className="h-full flex gap-6 overflow-x-auto pb-4 font-mono">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {COLUMNAS.map(col => (
          <KanbanColumn 
            key={col} 
            id={col}
            titulo={ESTADO_LABEL[col]} 
            tareas={tareasPorEstado[col]} 
            onTareaClick={onTareaClick}
          />
        ))}

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.5' } }
          })
        }}>
          {activeTarea ? (
            <div className="bg-white p-4 rounded-sm border border-[#A44A3F]/20 shadow-xl w-[280px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: ESTADO_COLOR[activeTarea.estado] }} />
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  {ESTADO_LABEL[activeTarea.estado]}
                </span>
              </div>
              <p className="text-sm font-bold text-[#333] tracking-tight">{activeTarea.titulo}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

function KanbanColumn({ id, titulo, tareas, onTareaClick, ...props }: { id: string, titulo: string, tareas: Tarea[], onTareaClick: (t: Tarea) => void, [key: string]: any }) {
  const { setNodeRef } = useSortable({ id })

  return (
    <div 
      ref={setNodeRef}
      className="flex-1 min-w-[300px] flex flex-col bg-[#FCFCFC] border border-black/[0.06] rounded-sm p-4 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6 px-1">
        <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#333]">
          {titulo} <span className="text-[#A44A3F] ml-2">{tareas.length}</span>
        </h3>
        <button className="text-gray-300 hover:text-[#A44A3F] transition-colors">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <SortableContext items={tareas.map(t => String(t.id))} strategy={verticalListSortingStrategy}>
          {tareas.map(tarea => (
            <SortableCard key={tarea.id} tarea={tarea} onClick={() => onTareaClick(tarea)} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

function SortableCard({ tarea, onClick, ...props }: { tarea: Tarea, onClick: () => void, [key: string]: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: String(tarea.id) })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layoutId={String(tarea.id)}
      onClick={onClick}
      className="bg-white p-4 rounded-sm border border-black/[0.06] shadow-sm hover:shadow-md hover:border-[#A44A3F]/20 cursor-grab active:cursor-grabbing group transition-all"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="w-8 h-1 rounded-full" style={{ background: ESTADO_COLOR[tarea.estado] }} />
        <div className="text-[9px] uppercase tracking-widest text-gray-300 font-bold group-hover:text-[#A44A3F]">
          ID-{tarea.id.toString().padStart(3, '0')}
        </div>
      </div>
      
      <p className="text-[13px] font-bold text-[#333] mb-4 leading-relaxed group-hover:text-[#A44A3F]">
        {tarea.titulo}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {tarea.manoDeObra?.[0]?.encargado ? (
            <div className="w-6 h-6 rounded-full bg-gray-100 border border-white flex items-center justify-center text-[9px] font-bold text-gray-500">
              {tarea.manoDeObra[0].encargado.nombre.charAt(0)}
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-50 border border-dashed border-gray-200" />
          )}
        </div>
        
        {tarea.fechaInicio && (
          <div className="text-[9px] uppercase tracking-tighter text-gray-400 font-bold">
            {new Date(tarea.fechaInicio).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
          </div>
        )}
      </div>
    </motion.div>
  )
}