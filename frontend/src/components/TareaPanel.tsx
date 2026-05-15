import { useState, useEffect, useCallback } from 'react'
import type { Tarea, EstadoTarea, PrioridadTarea } from '../types'
import type { CreateTareaInput, UpdateTareaInput } from '../types/inputs'
import { motion, AnimatePresence } from 'motion/react'
import { useTareaPanel } from '@/hooks/useTareaPanel'

interface Props {
  open: boolean
  tarea?: Tarea | null
  obraId: number
  totalTareas: number
  onClose: () => void
  onCreate: (data: CreateTareaInput) => Promise<void>
  onUpdate: (id: number, data: UpdateTareaInput) => Promise<void>
  onDelete: (id: number) => Promise<void>
  loading: boolean
  onCambiarEstado?: (id: number, nuevoEstado: EstadoTarea, notas?: string) => Promise<Tarea | void>
}

export default function TareaPanel({
  open, tarea, obraId, totalTareas,
  onClose, onCreate, onUpdate, onDelete, loading, onCambiarEstado
}: Props) {
 
 
const {
  isNew, isEditing, setIsEditing,
  titulo, setTitulo,
  descripcion, setDescripcion,
  fechaInicio, setFechaInicio,
  fechaFin, setFechaFin,
  estado, setEstado,
  prioridad, setPrioridad,
  handleSubmit,
} = useTareaPanel({ tarea, obraId, open, onClose, onCreate, onUpdate, onCambiarEstado })




  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/5"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[420px] bg-white border-l border-black/[0.08] shadow-[-16px_0_48px_rgba(0,0,0,0.12)] z-50 flex flex-col font-mono"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-black/[0.07] shrink-0 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <p className="text-[11px] tracking-[0.3em] uppercase text-[#A44A3F] font-bold">
                  {isNew ? 'Nueva tarea_' : 'Tarea_'}
                </p>
                {!isNew && !isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-1 rounded hover:bg-[#A44A3F]/10 text-[#A44A3F] transition-colors group"
                    title="Editar (E)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4">
                {tarea && !isEditing && (
                  <div className="flex gap-1">
                    <button  className="p-1.5 hover:bg-black/5 rounded text-gray-400 hover:text-[#333] transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button  className="p-1.5 hover:bg-black/5 rounded text-gray-400 hover:text-[#333] transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6 6-6"/></svg>
                    </button>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="text-[#6B7280] hover:text-[#A44A3F] transition-colors p-1"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-8">
              {/* Título */}
              <div className="space-y-3">
                <label className="text-[10px] tracking-[0.25em] uppercase text-[#A44A3F] font-bold block opacity-60">
                  Nombre
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={titulo}
                    onChange={e => setTitulo(e.target.value)}
                    placeholder="Ej: Hormigonado de platea"
                    autoFocus
                    className="w-full bg-transparent border-b-2 border-black/[0.1] pb-3 text-[22px] font-bold tracking-tight text-[#333] outline-none focus:border-[#A44A3F] transition-all placeholder:text-gray-200"
                  />
                ) : (
                  <h2 className="text-[24px] font-bold tracking-tight text-[#333] leading-none">
                    {titulo}
                  </h2>
                )}
              </div>

              {/* Descripción */}
              <div className="space-y-3">
                <label className="text-[10px] tracking-[0.25em] uppercase text-[#A44A3F] font-bold block opacity-60">
                  Descripción
                </label>
                {isEditing ? (
                  <textarea
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                    placeholder="Detalles técnicos o notas..."
                    rows={4}
                    className="w-full bg-gray-50/50 border border-black/[0.05] p-4 text-[13px] text-[#555] outline-none focus:border-[#A44A3F]/30 rounded-sm transition-all resize-none font-mono"
                  />
                ) : (
                  <p className="text-[13px] text-[#6B7280] leading-relaxed whitespace-pre-wrap italic">
                    {descripcion || 'Sin descripción adicional.'}
                  </p>
                )}
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] tracking-[0.25em] uppercase text-[#A44A3F] font-bold block opacity-60">
                    Inicio
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={fechaInicio}
                      onChange={e => setFechaInicio(e.target.value)}
                      className="w-full bg-transparent border-b border-black/[0.1] py-2 text-[13px] text-[#333] outline-none focus:border-[#A44A3F] transition-all"
                    />
                  ) : (
                    <div className="text-[13px] text-[#333] font-bold py-1">
                      {fechaInicio ? new Date(fechaInicio).toLocaleDateString('es', { day: '2-digit', month: 'long', year: 'numeric' }) : 'No programado'}
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] tracking-[0.25em] uppercase text-[#A44A3F] font-bold block opacity-60">
                    Fin
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={fechaFin}
                      onChange={e => setFechaFin(e.target.value)}
                      className="w-full bg-transparent border-b border-black/[0.1] py-2 text-[13px] text-[#333] outline-none focus:border-[#A44A3F] transition-all"
                    />
                  ) : (
                    <div className="text-[13px] text-[#333] font-bold py-1">
                      {fechaFin ? new Date(fechaFin).toLocaleDateString('es', { day: '2-digit', month: 'long', year: 'numeric' }) : 'No programado'}
                    </div>
                  )}
                </div>
              </div>

              {/* Estado + Prioridad */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] tracking-[0.25em] uppercase text-[#A44A3F] font-bold block opacity-60">
                    Estado
                  </label>
{isNew ? (
  // 👉 CREANDO → estado fijo
  <div className="flex items-center gap-2 py-1">
    <div
      className="w-2 h-2 rounded-full"
      style={{ background: '#67E8F9' }} // PENDIENTE
    />
    <span className="text-[11px] font-bold uppercase tracking-widest">
      PENDIENTE
    </span>
  </div>
) : isEditing ? (
  // 👉 EDITANDO → select
  <select
    value={estado}
    onChange={e => setEstado(e.target.value as EstadoTarea)}
    className="w-full bg-transparent border-b border-black/[0.1] py-2 text-[11px] text-[#333] outline-none focus:border-[#A44A3F] transition-all uppercase font-bold cursor-pointer"
  >
    <option value="PENDIENTE">PENDIENTE</option>
    <option value="ATRASADA">ATRASADA</option>
    <option value="EN_PROCESO">EN PROCESO</option>
    <option value="FINALIZADA">FINALIZADA</option>
  </select>
) : (
  // 👉 SOLO VER → badge
  <div className="flex items-center gap-2 py-1">
    <div
      className="w-2 h-2 rounded-full"
      style={{
        background: {
          PENDIENTE: '#67E8F9',
          ATRASADA: '#EF4444',
          EN_PROCESO: '#84CC16',
          FINALIZADA: '#F59E0B',
        }[estado],
      }}
    />
    <span className="text-[11px] font-bold uppercase tracking-widest">
      {estado}
    </span>
  </div>
)}
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] tracking-[0.25em] uppercase text-[#A44A3F] font-bold block opacity-60">
                    Prioridad
                  </label>
                  {isEditing ? (
                    <select
                      value={prioridad}
                      onChange={e => setPrioridad(e.target.value as PrioridadTarea)}
                      className="w-full bg-transparent border-b border-black/[0.1] py-2 text-[11px] text-[#333] outline-none focus:border-[#A44A3F] transition-all uppercase font-bold cursor-pointer"
                    >
                      <option value="ALTA">ALTA</option>
                      <option value="MEDIA">MEDIA</option>
                      <option value="BAJA">BAJA</option>
                    </select>
                  ) : (
                    <div className="text-[11px] font-bold uppercase tracking-widest py-1 border-b border-black/[0.05] inline-block">
                      {prioridad}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-black/[0.07] shrink-0 bg-gray-50/30 flex items-center gap-6">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !titulo.trim()}
                    className="flex-1 bg-[#333] text-white py-3 rounded-sm flex items-center justify-center gap-3 hover:bg-[#A44A3F] transition-all group disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    )}
                    <span className="text-[11px] tracking-[0.2em] uppercase font-bold">
                      {isNew ? 'Crear Tarea' : 'Guardar Cambios'}
                    </span>
                  </button>
                  <button
                    onClick={() => isNew ? onClose() : setIsEditing(false)}
                    className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold hover:text-[#333] transition-colors"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 border border-black/[0.1] text-[#333] py-3 rounded-sm flex items-center justify-center gap-3 hover:border-[#A44A3F] hover:text-[#A44A3F] transition-all group"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    <span className="text-[11px] tracking-[0.2em] uppercase font-bold">Editar Tarea</span>
                  </button>
                  {tarea && (
                    <button
                      onClick={() => {
                        if (confirm('¿Eliminar esta tarea?')) onDelete(tarea.id)
                      }}
                      className="p-3 text-[#A44A3F] opacity-40 hover:opacity-100 transition-opacity"
                      title="Eliminar"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}