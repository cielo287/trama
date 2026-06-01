import { useState } from 'react'
import type { ManoDeObra, Tarea } from '@/types'
import { calcularCostoManoDeObra } from '@/utils/tarea'
import SectionLabel from './ui/section-label'
import ManoDeObraForm from './ManoDeObraForm'
import type { CreateManoDeObraInput } from '@/types/inputs'

interface Props {
  tarea?: Tarea | null
  isEditing: boolean

  onAgregarManoDeObra: (
    tareaId: number,
    data: CreateManoDeObraInput
  ) => Promise<ManoDeObra>
}

export default function ManoDeObraSection({
  tarea,
  isEditing,
  onAgregarManoDeObra,
}: Props) {
  const manosDeObra = tarea?.manoDeObra ?? []

  const totalManoDeObra = tarea
    ? calcularCostoManoDeObra(tarea)
    : 0

  const [showForm, setShowForm] = useState(false)

  const handleSave = async (
    data: CreateManoDeObraInput
  ) => {
    if (!tarea) return

    try {
      await onAgregarManoDeObra(
        tarea.id,
        data
      )

      setShowForm(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="border border-black/[0.06] bg-gray-50/30 rounded-sm p-4 space-y-4">
      <SectionLabel>
        Mano de obra
      </SectionLabel>

      {showForm ? (
        <div
          className="
            border
            border-[#A44A3F]/20
            rounded-sm
            bg-white
            p-4
          "
        >
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
                <div
                  key={mano.id}
                  className="flex justify-between items-start text-[13px] font-mono"
                >
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

                  <span className="text-[#333] font-bold">
                    ${Number(mano.precio).toLocaleString()}
                  </span>
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
              className="
                px-2
                py-1
                rounded
                bg-[#A44A3F]/10
                text-[#A44A3F]
                text-[10px]
                font-bold
                uppercase
                tracking-[0.15em]
                hover:bg-[#A44A3F]/15
                transition-colors
              "
            >
              + Agregar mano de obra
            </button>
          )}
        </>
      )}
    </div>
  )
}