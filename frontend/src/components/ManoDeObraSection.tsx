import { useState } from 'react'
import type { ManoDeObra, Tarea } from '@/types'
import { calcularCostoManoDeObra } from '@/utils/tarea'
import SectionLabel from './ui/section-label'
import ManoDeObraForm from './ManoDeObraForm'
import type { CreateManoDeObraInput } from '@/types/inputs'

interface Props {
  tarea?: Tarea | null
  isEditing: boolean

  onAgregarManoDeObra: (tareaId: number, data: CreateManoDeObraInput) => Promise<ManoDeObra>
  onEditarManoDeObra: (tareaId: number, manoDeObraId: number, data: CreateManoDeObraInput) => Promise<ManoDeObra>
  onEliminarManoDeObra: (tareaId: number, manoDeObraId: number) => Promise<void>
}

export default function ManoDeObraSection({
  tarea,
  isEditing,
  onAgregarManoDeObra,
  onEditarManoDeObra,
  onEliminarManoDeObra
}: Props) {
  const manosDeObra = tarea?.manoDeObra ?? []

  const totalManoDeObra = tarea
    ? calcularCostoManoDeObra(tarea)
    : 0

  const [showForm, setShowForm] = useState(false)
    const [editandoId, setEditandoId] = useState<number | null>(null)

  const handleSave = async (data: CreateManoDeObraInput) => {
    if (!tarea) return
    try {
      await onAgregarManoDeObra(tarea.id, data)
      setShowForm(false)
    } catch (error) {
      console.error(error)
    }
  }

    const handleEditar = async (data: CreateManoDeObraInput) => {
    if (!tarea || editandoId === null) return
    try {
      await onEditarManoDeObra(tarea.id, editandoId, data)
      setEditandoId(null)
    } catch (error) {
      console.error(error)
    }
  }

return (
  <div className="border border-black/[0.06] bg-gray-50/30 rounded-sm p-4 space-y-4">
    <SectionLabel>Mano de obra</SectionLabel>
    {showForm ? (
      <div className="border border-[#A44A3F]/20 rounded-sm bg-white p-4">
        <ManoDeObraForm
          onCancel={() => setShowForm(false)}
          onSave={handleSave}
        />
      </div>
    ) : (
      <>
        {manosDeObra.length === 0 ? (
          <p className="text-[13px] text-[#6B7280] italic font-mono">
            Sin mano de obra cargada.
          </p>
        ) : (
          <div className="space-y-3">
            {manosDeObra.map(mano => (
              <div key={mano.id}>
                {editandoId === mano.id ? (
                  <div className="border border-[#A44A3F]/20 rounded-sm bg-white p-4">
                    <ManoDeObraForm
                      initialData={{
                        nombre: mano.encargado?.nombre ?? '',
                        apellido: mano.encargado?.apellido ?? '',
                        telefono: mano.encargado?.telefono ?? '',
                        precio: Number(mano.precio),
                      }}
                      onCancel={() => setEditandoId(null)}
                      onSave={handleEditar}
                    />
                  </div>
                ) : (
                  <div className="flex justify-between items-start text-[13px] font-mono">
                    <div>
                      <p className="text-[#333] font-medium">
                        {mano.encargado
                          ? `${mano.encargado.nombre} ${mano.encargado.apellido}`
                          : 'Sin encargado'}
                      </p>
                      {mano.encargado?.telefono && (
                        <p className="text-[#6B7280] text-[12px]">
                          {mano.encargado.telefono}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#333] font-bold">
                        ${Number(mano.precio).toLocaleString()}
                      </span>
                      {isEditing && (
                        <>
                          <button
                            type="button"
                            onClick={() => setEditandoId(mano.id)}
                            className="text-[#6B7280] hover:text-[#A44A3F] transition-colors"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                              <path d="m15 5 4 4"/>
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => tarea && onEliminarManoDeObra(tarea.id, mano.id)}
                            className="text-[#6B7280] hover:text-red-400 transition-colors"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="border-t border-black/[0.08] pt-3 flex justify-between items-center">
              <span className="text-[11px] uppercase tracking-widest font-bold text-[#A44A3F]">
                Total
              </span>
              <span className="text-[#333] font-bold">
                ${totalManoDeObra.toLocaleString()}
              </span>
            </div>
          </div>
        )}
        {isEditing && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="px-2 py-1 rounded bg-[#A44A3F]/10 text-[#A44A3F] text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[#A44A3F]/15 transition-colors"
          >
            + Agregar mano de obra
          </button>
        )}
      </>
    )}
  </div>
)
}