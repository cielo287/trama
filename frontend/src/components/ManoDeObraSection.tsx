import type { Tarea } from '@/types'
import { calcularCostoManoDeObra } from '@/utils/tarea'
import SectionLabel from './ui/section-label'

interface Props {
  tarea?: Tarea | null
  isEditing: boolean
}

export default function ManoDeObraSection({
  tarea,
  isEditing,
}: Props) {
  const manosDeObra = tarea?.manoDeObra ?? []

  const totalManoDeObra = tarea
    ? calcularCostoManoDeObra(tarea)
    : 0

  return (
    <div className="border border-black/[0.06] bg-gray-50/30 rounded-sm p-4 space-y-4">
      <SectionLabel>
        Mano de obra
      </SectionLabel>

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
                  <p className="text-[#6B7280] text-[12px] font-mono">
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
    </div>
  )
}