import { useState, useEffect } from 'react'
import type { Tarea, EstadoTarea, PrioridadTarea } from '@/types'
import type { CreateTareaInput, UpdateTareaInput } from '@/types/inputs'

interface Props {
  open: boolean
  tarea?: Tarea | null        // si viene tarea → editar, si no → crear
  obraId: number
  totalTareas: number         // para calcular ordenEjecucion
  onClose: () => void
  onCreate: (data: CreateTareaInput) => Promise<void>
  onUpdate: (id: number, data: UpdateTareaInput) => Promise<void>
  onDelete: (id: number) => Promise<void>
  loading: boolean
}

export default function TareaPanel({
  open, tarea, obraId, totalTareas,
  onClose, onCreate, onUpdate, onDelete, loading
}: Props) {
  const isEdit = !!tarea

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [estado, setEstado] = useState<EstadoTarea>('PENDIENTE')
  const [prioridad, setPrioridad] = useState<PrioridadTarea>('ALTA')

  useEffect(() => {
    if (tarea) {
      setTitulo(tarea.titulo)
      setDescripcion(tarea.descripcion ?? '')
      setFechaInicio(tarea.fechaInicio ? tarea.fechaInicio.slice(0, 10) : '')
      setFechaFin(tarea.fechaFin ? tarea.fechaFin.slice(0, 10) : '')
      setEstado((tarea.estado as EstadoTarea) ?? 'PENDIENTE')
      setPrioridad((tarea.prioridad as PrioridadTarea) ?? 'ALTA')
    } else {
      setTitulo('')
      setDescripcion('')
      setFechaInicio('')
      setFechaFin('')
      setEstado('PENDIENTE')
      setPrioridad('ALTA')
    }
  }, [tarea, open])

  async function handleSubmit() {
    if (!titulo.trim()) return

    if (isEdit && tarea) {
      await onUpdate(tarea.id, {
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        fechaInicio: fechaInicio || undefined,
        fechaFin: fechaFin || undefined,
        estado,
        prioridad,
      })
    } else {
      await onCreate({
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        fechaInicio: fechaInicio || undefined,
        fechaFin: fechaFin || undefined,
        estado,
        prioridad,
        obraId,
        ordenEjecucion: totalTareas + 1,
      })
    }
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[380px] bg-white border-l border-black/[0.08] shadow-[-8px_0_32px_rgba(0,0,0,0.06)] z-40 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-black/[0.07] shrink-0">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#A44A3F] font-bold">
            {isEdit ? 'Editar tarea_' : 'Nueva tarea_'}
          </p>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#333] transition-colors text-lg leading-none opacity-40 hover:opacity-100"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Título */}
          <div className="space-y-1">
            <label className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#A44A3F] font-bold block">
              Nombre
            </label>
            <input
              type="text"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ej: Hormigonado de platea"
              autoFocus
              className="w-full bg-transparent border-b-2 border-[#333] pb-2 text-[18px] font-light tracking-tight text-[#333] outline-none focus:border-[#A44A3F] transition-colors placeholder:text-gray-300"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <label className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#A44A3F] font-bold block">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder="Opcional"
              rows={2}
              className="w-full bg-transparent border-b border-[#ddd] pb-1 text-[13px] text-[#555] outline-none focus:border-[#A44A3F] transition-colors resize-none font-mono placeholder:text-gray-300"
            />
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#A44A3F] font-bold block">
                Inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={e => setFechaInicio(e.target.value)}
                className="w-full bg-transparent border-b border-[#ddd] py-1 text-[13px] text-[#555] outline-none focus:border-[#A44A3F] transition-colors font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#A44A3F] font-bold block">
                Fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={e => setFechaFin(e.target.value)}
                className="w-full bg-transparent border-b border-[#ddd] py-1 text-[13px] text-[#555] outline-none focus:border-[#A44A3F] transition-colors font-mono"
              />
            </div>
          </div>

          {/* Estado + Prioridad */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#A44A3F] font-bold block">
                Estado
              </label>
              <select
                value={estado}
                onChange={e => setEstado(e.target.value as EstadoTarea)}
                className="w-full bg-transparent border-b border-[#ddd] py-1 text-[13px] text-[#333] outline-none focus:border-[#A44A3F] transition-colors font-mono cursor-pointer uppercase"
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_PROCESO">En proceso</option>
                <option value="FINALIZADA">Finalizada</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#A44A3F] font-bold block">
                Prioridad
              </label>
              <select
                value={prioridad}
                onChange={e => setPrioridad(e.target.value as PrioridadTarea)}
                className="w-full bg-transparent border-b border-[#ddd] py-1 text-[13px] text-[#333] outline-none focus:border-[#A44A3F] transition-colors font-mono cursor-pointer uppercase"
              >
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Media</option>
                <option value="BAJA">Baja</option>
              </select>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-black/[0.07] shrink-0 flex items-center gap-4 bg-white">
          <button
            onClick={handleSubmit}
            disabled={loading || !titulo.trim()}
            className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-6 h-6 rounded-full bg-[#A44A3F] flex items-center justify-center shadow-[0_3px_10px_rgba(164,74,63,0.25)]">
              <svg width="10" height="8" viewBox="0 0 12 10" fill="none">
                <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase font-bold text-[#333]">
              {loading ? 'Guardando...' : isEdit ? 'Guardar' : 'Crear tarea'}
            </span>
          </button>

          <button
            onClick={onClose}
            className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#6B7280] italic hover:text-[#333] transition-colors"
          >
            Cancelar
          </button>

          {isEdit && tarea && (
            <button
              onClick={() => onDelete(tarea.id)}
              className="ml-auto font-mono text-[11px] tracking-[0.15em] uppercase text-[#A44A3F] opacity-40 hover:opacity-100 transition-opacity"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </>
  )
}