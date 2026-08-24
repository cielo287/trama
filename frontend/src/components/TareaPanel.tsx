import type { Tarea, EstadoTarea, PrioridadTarea, DetalleMaterial, ManoDeObra } from '../types'
import type { CreateDetalleMaterialInput, CreateManoDeObraInput, CreateTareaInput, UpdateTareaInput } from '../types/inputs'
import { motion, AnimatePresence } from 'motion/react'
import { useTareaPanel } from '@/hooks/useTareaPanel'
import MaterialesSection from './MaterialesSection'
import ManoDeObraSection from './ManoDeObraSection'
import SectionLabel from './ui/section-label'
import { formatFechaCalendario } from '@/utils/fecha'
import { fechaRealFin, fechaRealInicio } from '@/utils/tarea'

interface Props {
  open: boolean
  tarea?: Tarea | null
  obraId: number
  totalTareas: number
  onClose: () => void
  onCreate: (data: CreateTareaInput) => Promise<Tarea>
  onCreated?: (tarea: Tarea) => void
  onUpdate: (id: number, data: UpdateTareaInput) => Promise<void>
  onDelete: (id: number) => Promise<void>
  loading: boolean
  onCambiarEstado?: (id: number, nuevoEstado: EstadoTarea, notas?: string) => Promise<Tarea | void>
  onNext: () => void
  onPrevious: () => void
  onAgregarMaterial: (tareaId: number, data: CreateDetalleMaterialInput) => Promise<DetalleMaterial>
  onEditarMaterial: (tareaId: number, detalleId: number, data: CreateDetalleMaterialInput) => Promise<DetalleMaterial>
  onAgregarManoDeObra: (tareaId: number, data: CreateManoDeObraInput) => Promise<ManoDeObra>
  onEditarManoDeObra: (tareaId: number, manoDeObraId: number, data: CreateManoDeObraInput) => Promise<ManoDeObra>
  abrirEnEdicion: boolean
  onBorrarDetalleMaterial: (tareaId: number, detalleId: number) => Promise<void>
  onEliminarManoDeObra: (tareaId: number, manoDeObraId: number) => Promise<void>
  onRequestDelete: (tarea: Tarea) => void
}

export default function TareaPanel({
  open, 
  tarea, 
  obraId, 
  totalTareas,
  onClose, 
  onCreate, 
  onCreated, 
  onUpdate, 
  onDelete,
  onRequestDelete, 
  loading, 
  onCambiarEstado,
   onNext, 
   onPrevious, 
   onAgregarMaterial, 
   onEditarMaterial, 
   onAgregarManoDeObra, 
   onEditarManoDeObra,
   abrirEnEdicion,
   onBorrarDetalleMaterial,
   onEliminarManoDeObra
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
} = useTareaPanel({ tarea, 
  obraId, 
  open, 
  onClose, 
  onCreate,
  onCreated, 
  onUpdate, 
  onCambiarEstado, 
  onNext, 
  onPrevious,
  abrirEnEdicion
 })
  

const PRIORIDAD_COLOR: Record<PrioridadTarea, string> = {
  ALTA: '#EF4444',     // rojo
  MEDIA: '#F59E0B',    // amarillo
  BAJA: '#84CC16',     // verde
}

const ESTADO_COLOR: Record<EstadoTarea, string> = {
  PENDIENTE: '#CDC5C5',
  EN_CURSO: '#16F7E8',
  FINALIZADA: '#84CC16',
}

const fechasBloqueadas = !isNew && (estado === 'EN_CURSO' || estado === 'FINALIZADA')

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
                    <button 
                      onClick={onPrevious}
                      className="p-1.5 hover:bg-black/5 rounded text-gray-400 hover:text-[#333] transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button 
                      onClick={onNext}
                      className="p-1.5 hover:bg-black/5 rounded text-gray-400 hover:text-[#333] transition-colors">
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
              <div className="relative border border-black/[0.06] bg-gray-50/30 rounded-sm p-6 space-y-8">
              {/* Título */}
              <div className="space-y-3">
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
                  <SectionLabel>Inicio</SectionLabel>
                  {isEditing && !fechasBloqueadas ? (
                    <input
                      type="date"
                      value={fechaInicio}
                      onChange={e => setFechaInicio(e.target.value)}
                      className="w-full bg-transparent border-b border-black/[0.1] py-2 text-[13px] text-[#333] outline-none focus:border-[#A44A3F] transition-all"
                    />
                  ) : (
                    <div className="text-[13px] text-[#333] font-bold py-1">
                      {fechaInicio ? formatFechaCalendario(fechaInicio) : 'No programado'}
                    </div>
                    
                  )}
                </div>
                <div className="space-y-3">
                  <SectionLabel>Fin</SectionLabel>
                  {isEditing && !fechasBloqueadas ? (
                    <input
                      type="date"
                      value={fechaFin}
                      onChange={e => setFechaFin(e.target.value)}
                      className="w-full bg-transparent border-b border-black/[0.1] py-2 text-[13px] text-[#333] outline-none focus:border-[#A44A3F] transition-all"
                    />
                  ) : (
                    <div className="text-[13px] text-[#333] font-bold py-1">
                      {fechaFin ? formatFechaCalendario(fechaFin) : 'No programado'}
                    </div>
                  )}
                </div>
              </div>
              {!isEditing && tarea && (fechaRealInicio(tarea) || fechaRealFin(tarea)) && (
  <div className="grid grid-cols-2 gap-8 pt-2 border-t border-black/[0.04]">
    <div className="space-y-1">
      <SectionLabel>Inicio real</SectionLabel>
      <div className="text-[12px] text-[#6B7280]">
        {fechaRealInicio(tarea) ? formatFechaCalendario(fechaRealInicio(tarea)!) : '—'}
      </div>
    </div>
    <div className="space-y-1">
      <SectionLabel>Fin real</SectionLabel>
      <div className="text-[12px] text-[#6B7280]">
        {fechaRealFin(tarea) ? formatFechaCalendario(fechaRealFin(tarea)!) : '—'}
      </div>
    </div>
  </div>
)}

              {/* Estado + Prioridad */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <SectionLabel>Estado</SectionLabel>
{isNew ? (
  // 👉 CREANDO → estado fijo
  <div className="flex items-center gap-2 py-1">
    <div
      className="w-2 h-2 rounded-full"
      style={{ background: '#CDC5C5' }} // PENDIENTE
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
    <option value="EN_CURSO">EN CURSO</option>
    <option value="FINALIZADA">FINALIZADA</option>
  </select>
) : (
  // 👉 SOLO VER → badge
  <div className="flex items-center gap-2 py-1">
    <div
      className="w-2 h-2 rounded-full"
      style={{ background: ESTADO_COLOR[estado] }}
    />
    <span className="text-[11px] font-bold uppercase tracking-widest">
      {estado}
    </span>
  </div>
)}
                </div>
                <div className="space-y-3">
                  <SectionLabel>Prioridad</SectionLabel>
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
<div className="flex items-center gap-2 py-1">
  <div
    className="w-2 h-2 rounded-full"
    style={{ background: PRIORIDAD_COLOR[prioridad] }}
  />
  <span className="text-[11px] font-bold uppercase tracking-widest">
    {prioridad}
  </span>
</div>
                  )}
                </div>
              </div>
              </div>
{isNew ? (
  <div className="border border-dashed border-black/[0.08] rounded-sm p-4 bg-gray-50/30">
    <p className="text-[12px] text-[#6B7280] italic">
      Guarda la tarea primero para poder agregar materiales y mano de obra.
    </p>
  </div>
) : (
  <>
    <MaterialesSection
      tarea={tarea}
      isEditing={isEditing}
      onAgregarMaterial={onAgregarMaterial}
      onEditarMaterial={onEditarMaterial}
      onBorrarDetalleMaterial={onBorrarDetalleMaterial}
    />

    <ManoDeObraSection
      tarea={tarea}
      isEditing={isEditing}
      onAgregarManoDeObra={onAgregarManoDeObra}
      onEditarManoDeObra={onEditarManoDeObra}
      onEliminarManoDeObra={onEliminarManoDeObra}
    />
  </>
)
}



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
    onClick={() => onRequestDelete(tarea)}
    className="p-3 text-[#A44A3F] opacity-40 hover:opacity-100 transition-opacity"
    title="Eliminar"
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M3 6h18M19 6v14c0 1-1 2-1 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
    </svg>
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