import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
  useDroppable,
} from '@dnd-kit/core'

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'

import { motion } from 'motion/react'

import { type EstadoTarea, type Tarea } from '../types'

import { useKanban } from '../hooks/useKanban'
import { formatFechaCalendario } from '@/utils/fecha'

type Estado =
  | 'PENDIENTE'
  | 'EN_PROCESO'
  | 'ATRASADA'
  | 'FINALIZADA'

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

  onUpdateTareas: (
    nuevasTareas: Tarea[]
  ) => void

  onCambiarEstado?: (
    id: number,
    nuevoEstado: EstadoTarea,
    notas?: string
  ) => Promise<Tarea | void>

  onTareaClick: (
    tarea: Tarea
  ) => void

  onNuevaTarea: () => void
}

export default function Kanban({
  tareas,
  onUpdateTareas,
  onCambiarEstado,
  onTareaClick,
}: Props) {

  const {
    columns,
    activeTarea,
    sensors,
    tareasPorEstado,
    collisionDetectionStrategy,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useKanban({
    tareas,
    onUpdateTareas,
    onEstadoChange: (id, estado) =>
      onCambiarEstado?.(id, estado),
  })

  return (
    <div className="h-full flex gap-6 overflow-x-auto pb-4 font-mono">

      <DndContext
        sensors={sensors}
        collisionDetection={
          collisionDetectionStrategy
        }
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >

        {columns.map(col => (
          <KanbanColumn
            key={col}
            id={col}
            titulo={ESTADO_LABEL[col]}
            tareas={tareasPorEstado[col]}
            onTareaClick={onTareaClick}
          />
        ))}

        <DragOverlay
          dropAnimation={{
            sideEffects:
              defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: '0.5'
                  }
                }
              })
          }}
        >

          {activeTarea ? (
            <div className="bg-white p-4 rounded-sm border border-[#A44A3F]/20 shadow-xl w-[280px]">

              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background:
                      ESTADO_COLOR[
                        activeTarea.estado
                      ]
                  }}
                />

                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  {
                    ESTADO_LABEL[
                      activeTarea.estado
                    ]
                  }
                </span>
              </div>

              <p className="text-sm font-bold text-[#333] tracking-tight">
                {activeTarea.titulo}
              </p>

            </div>
          ) : null}

        </DragOverlay>

      </DndContext>

    </div>
  )
}

function KanbanColumn({
  id,
  titulo,
  tareas,
  onTareaClick,
}: {
  id: string
  titulo: string
  tareas: Tarea[]
  onTareaClick: (t: Tarea) => void
}) {

  const { setNodeRef } =
    useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className="flex-1 min-w-[300px] flex flex-col bg-[#FCFCFC] border border-black/[0.06] rounded-sm p-4 shadow-sm"
    >

      <div className="flex items-center justify-between mb-6 px-1">

        <h3 className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#333]">
          {titulo}

          <span className="text-[#A44A3F] ml-2">
            {tareas.length}
          </span>
        </h3>

        <button className="text-gray-300 hover:text-[#A44A3F] transition-colors">

          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>

        </button>

      </div>

      <div className="flex-1 flex flex-col gap-3">

        <SortableContext
          items={tareas.map(
            t => String(t.id)
          )}
          strategy={
            verticalListSortingStrategy
          }
        >

          {tareas.map(tarea => (
            <SortableCard
              key={tarea.id}
              tarea={tarea}
              onClick={() =>
                onTareaClick(tarea)
              }
            />
          ))}

        </SortableContext>

      </div>

    </div>
  )
}

function SortableCard({
  tarea,
  onClick,
}: {
  tarea: Tarea
  onClick: () => void
}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: String(tarea.id)
  })

  const style = {
    transform:
      CSS.Transform.toString(transform),

    transition,

    opacity:
      isDragging ? 0.3 : 1,
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

        <div
          className="w-8 h-1 rounded-full"
          style={{
            background:
              ESTADO_COLOR[
                tarea.estado
              ]
          }}
        />

        <div className="text-[9px] uppercase tracking-widest text-gray-300 font-bold group-hover:text-[#A44A3F]">
          ID-
          {tarea.id
            .toString()
            .padStart(3, '0')}
        </div>

      </div>

      <p className="text-[13px] font-bold text-[#333] mb-4 leading-relaxed group-hover:text-[#A44A3F]">
        {tarea.titulo}
      </p>

      <div className="flex items-center justify-between">

        <div className="flex -space-x-2">

          {tarea.manoDeObra?.[0]?.encargado ? (

            <div className="w-6 h-6 rounded-full bg-gray-100 border border-white flex items-center justify-center text-[9px] font-bold text-gray-500">

              {
                tarea
                  .manoDeObra[0]
                  .encargado.nombre
                  .charAt(0)
              }

            </div>

          ) : (

            <div className="w-6 h-6 rounded-full bg-gray-50 border border-dashed border-gray-200" />

          )}

        </div>

        {tarea.fechaInicio && (

          <div className="text-[9px] uppercase tracking-tighter text-gray-400 font-bold">

            {formatFechaCalendario(tarea.fechaInicio)}

          </div>

        )}

      </div>

    </motion.div>
  )
}