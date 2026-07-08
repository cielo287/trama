import React from 'react';
import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
  useDroppable,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'motion/react';
import { Tarea, EstadoTarea, PrioridadTarea } from '../types';
import { useKanban } from '../hooks/useKanban';
import { formatFechaCalendario } from '../utils/fecha';
import { 
  Calendar, 
  User, 
  Plus, 
  CheckSquare, 
  Package, 
  AlertTriangle,
  Flame,
  Clock,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';

import { calcularAtraso } from '@/utils/tarea';

const ATRASO_COLOR = '#F99783';

const ESTADO_LABEL: Record<EstadoTarea, string> = {
  PENDIENTE: 'Pendiente',
  EN_CURSO: 'En Curso',
  FINALIZADA: 'Finalizada',
};

const ESTADO_COLOR: Record<EstadoTarea, string> = {
  PENDIENTE: '#CDC5C5',
  EN_CURSO: '#16F7E8',
  FINALIZADA: '#84CC16',
};

const ESTADO_BG_LIGHT: Record<EstadoTarea, string> = {
  PENDIENTE: 'bg-[#F2EFF0]',
  EN_CURSO: 'bg-[#E3FEFC]',
  FINALIZADA: 'bg-[#F1FCE3]',
};

const PRIORIDAD_COLORS: Record<
  PrioridadTarea,
  { bg: string; text: string; border: string }
> = {
  ALTA: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  MEDIA: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  BAJA: {
    bg: 'bg-lime-50',
    text: 'text-lime-700',
    border: 'border-lime-200',
  },
}

const PRIORIDAD_COLOR: Record<PrioridadTarea, string> = {
  ALTA: '#EF4444',     // rojo
  MEDIA: '#F59E0B',    // amarillo
  BAJA: '#84CC16',     // verde
}

interface Props {
  tareas: Tarea[];
  fecha: Date;
  onUpdateTareas: (nuevasTareas: Tarea[]) => void;
  onCambiarEstado?: (
    id: number,
    nuevoEstado: EstadoTarea,
    notas?: string
  ) => Promise<Tarea | void>;
  onTareaClick: (tarea: Tarea) => void;
  onNuevaTarea: (defaultEstado?: EstadoTarea) => void;
}

export default function Kanban({
  tareas,
  fecha,
  onUpdateTareas,
  onCambiarEstado,
  onTareaClick,
  onNuevaTarea,
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
    fecha,
    onUpdateTareas,
    onEstadoChange: async (id, estado) => {
      await onCambiarEstado?.(id, estado);
    },
  });

  return (
    <div className="h-full flex gap-6 overflow-x-auto pb-6 font-mono select-none px-1">
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
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
            onNuevaTarea={() => onNuevaTarea(col)}
          />
        ))}

        <DragOverlay
          dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.4',
                },
              },
            }),
          }}
        >
          {activeTarea ? (
            <div className="bg-white p-5 rounded-sm border-2 border-[#A44A3F] shadow-[8px_8px_0px_rgba(164,74,63,0.15)] w-[300px] font-mono transform rotate-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: ESTADO_COLOR[activeTarea.estado] }}
                  />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                    {ESTADO_LABEL[activeTarea.estado]}
                  </span>
                </div>
                <div className="text-[9px] text-[#A44A3F] font-bold">
                  ID-{activeTarea.id.toString().padStart(3, '0')}
                </div>
              </div>

              <p className="text-xs font-bold text-[#333] tracking-tight mb-2">
                {activeTarea.titulo}
              </p>
              
              <div className="h-[2px] w-12 bg-[#A44A3F]/30" />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function KanbanColumn({
  id,
  titulo,
  tareas,
  onTareaClick,
  onNuevaTarea,
}: {
  id: EstadoTarea;
  titulo: string;
  tareas: Tarea[];
  onTareaClick: (t: Tarea) => void;
  onNuevaTarea: () => void;
  key?: any;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[250px] h-[calc(100vh-250px)] min-h-[650px] flex flex-col bg-[#FAFAFA] border ${
        isOver ? 'border-[#A44A3F]/50 shadow-[0_0_12px_rgba(164,74,63,0.06)] bg-[#FCFBFB]' : 'border-black/[0.07]'
      } rounded-sm p-4 transition-all duration-200 relative`}
    >
      {/* Blueprint Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.012)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none rounded-sm" />

      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-1 pb-2 border-b border-black/[0.04] relative z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-3 h-3 rounded-full border border-black/10 flex items-center justify-center"
            style={{ backgroundColor: ESTADO_COLOR[id] }}
          >
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
          <h3 className="font-sans text-[12px] uppercase tracking-[0.2em] font-bold text-[#333] flex items-center">
            {titulo}
            <span className="text-white ml-2 text-[9px] px-1.5 py-0.5 rounded-full bg-[#1A1A1A] font-bold tracking-normal">
              {tareas.length}
            </span>
          </h3>
        </div>

        <button 
          onClick={onNuevaTarea}
          className="text-gray-400 hover:text-[#A44A3F] hover:bg-black/[0.03] p-1 rounded-sm transition-all"
          title="Agregar Tarea"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Cards List */}
      <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-1.5 py-1 relative z-10 scrollbar-thin">
        <SortableContext
          items={tareas.map(t => String(t.id))}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence initial={false}>
            {tareas.length === 0 ? (
              <div 
                onClick={onNuevaTarea}
                className="flex-1 min-h-[140px] flex flex-col items-center justify-center border border-dashed border-black/10 rounded-sm hover:border-[#A44A3F]/40 hover:bg-white/50 cursor-pointer transition-all p-4 group"
              >
                <div className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 group-hover:text-[#A44A3F] group-hover:border-[#A44A3F]/40 transition-colors mb-2">
                  <Plus size={14} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 group-hover:text-gray-600 transition-colors">
                  Añadir Tarea
                </span>
              </div>
            ) : (
              tareas.map(tarea => (
                <SortableCard
                  key={tarea.id}
                  tarea={tarea}
                  onClick={() => onTareaClick(tarea)}
                />
              ))
            )}
          </AnimatePresence>
        </SortableContext>
      </div>
    </div>
  );
}

function SortableCard({
  tarea,
  onClick,
}: {
  tarea: Tarea;
  onClick: () => void;
  key?: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(tarea.id),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    '--state-color': ESTADO_COLOR[tarea.estado],
  } as React.CSSProperties;

  const prio = tarea.prioridad || 'MEDIA';
  const prioConfig = PRIORIDAD_COLORS[prio];

  // Calulate subtasks if mock or state exists
  const totalSubtasks = 0; // we can map these later or support description parsed list
  const activeSubtasks = 0;
  const { atrasada, dias } = calcularAtraso(tarea);
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layoutId={String(tarea.id)}
      onClick={onClick}
      className={`shrink-0 bg-white p-4 rounded-sm border ${
        isDragging
          ? 'border-[var(--state-color)] shadow-[4px_4px_0px_rgba(164,74,63,0.15)] bg-red-50/5'
          : atrasada
          ? 'border-[#F99783] shadow-[0_0_0_3px_rgba(249,151,131,0.25)]'
          : 'border-black/[0.08] shadow-[2px_2px_0px_rgba(0,0,0,0.02)] hover:shadow-[4px_4px_0px_rgba(0,0,0,0.04)] hover:border-[var(--state-color)]'
      } cursor-grab active:cursor-grabbing group transition-all duration-200 relative overflow-hidden`}
    >
      {/* Accent border on left representing construction rule based on status */}
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-transparent group-hover:bg-[var(--state-color)] transition-all" />

      {/* Card Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1.5">
          <span 
            className="w-2.5 h-2.5 rounded-full border border-black/5" 
            style={{ backgroundColor: ESTADO_COLOR[tarea.estado] }}
            title={ESTADO_LABEL[tarea.estado]}
          />
          <span className={`text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm ${prioConfig.bg} ${prioConfig.text} border ${prioConfig.border}`}>
            {prio}
          </span>
        </div>
        {atrasada && (
        <div className="flex items-center gap-1.5 mb-3 text-[9px] font-bold uppercase tracking-wide" style={{ color: ATRASO_COLOR }}>
          <AlertTriangle size={11} strokeWidth={2.5} />
          <span>{dias === 0 ? 'Vence hoy' : `Lleva ${dias} día${dias === 1 ? '' : 's'} de atraso`}</span>
          </div>
      )}
        <div className="text-[9px] font-bold text-gray-300 group-hover:text-[var(--state-color)] transition-colors">
          ID-{tarea.id.toString().padStart(3, '0')}
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-[12px] font-bold text-[#2A2A2A] mb-3 leading-snug break-words">
        {tarea.titulo}
      </h4>

      {/* Task Description (Truncated) */}
      {tarea.descripcion && (
        <p className="text-[10px] text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {tarea.descripcion}
        </p>
      )}

      {/* Card Divider Line (Dotted blueprint style) */}
      <div className="border-t border-dashed border-gray-100 my-3" />

      {/* Card Footer */}
      <div className="flex items-center justify-between">
        {/* Workers Avatars */}
        <div className="flex -space-x-1.5 items-center">
          {tarea.manoDeObra && tarea.manoDeObra.length > 0 ? (
            tarea.manoDeObra.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-zinc-900 border border-white flex items-center justify-center text-[9px] font-bold text-white uppercase shadow-sm"
                title={`${item.encargado?.nombre} ${item.encargado?.apellido}`}
              >
                {item.encargado?.nombre.charAt(0)}
              </div>
            ))
          ) : (
            <div 
              className="w-5 h-5 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-300 hover:text-[var(--state-color)] hover:border-[var(--state-color)] transition-colors"
              title="Sin encargado asignado"
            >
              <User size={10} />
            </div>
          )}
          {tarea.manoDeObra && tarea.manoDeObra.length > 3 && (
            <span className="text-[8px] font-bold text-gray-400 pl-1">
              +{tarea.manoDeObra.length - 3}
            </span>
          )}
        </div>

        {/* Date Display */}
        {tarea.fechaInicio ? (
          <div className="flex items-center gap-1 text-[9px] uppercase font-bold text-gray-400 group-hover:text-gray-700 transition-colors bg-gray-50 px-1.5 py-0.5 rounded border border-black/[0.03]">
            <Calendar size={10} className="text-gray-400" />
            <span>{formatFechaCalendario(tarea.fechaInicio)}</span>
            {tarea.fechaFin && (
              <>
                <ArrowRight size={8} className="text-gray-300 mx-0.5" />
                <span>{formatFechaCalendario(tarea.fechaFin)}</span>
              </>
            )}
          </div>
        ) : (
          <span className="text-[8px] uppercase tracking-tight text-gray-300 group-hover:text-[var(--state-color)]/70 transition-colors">
            Sin fecha
          </span>
        )}
      </div>
    </motion.div>
  );
}