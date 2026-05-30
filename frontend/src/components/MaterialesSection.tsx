import type { Tarea } from '@/types'
import { calcularCostoMateriales } from '@/utils/tarea'
import SectionLabel from './ui/section-label'

interface Props {
  tarea?: Tarea | null
  isEditing: boolean
}

export default function MaterialesSection({
  tarea,
  isEditing,
}: Props) {
  const materiales = tarea?.detallesMaterial ?? []
  const totalMateriales = tarea
    ? calcularCostoMateriales(tarea)
    : 0

  return (
    <div className="border border-black/[0.06] bg-gray-50/30 rounded-sm p-4 space-y-4">
      <SectionLabel>
        Materiales
      </SectionLabel>

      {materiales.length === 0 ? (
        <p className="text-[13px] text-[#6B7280] italic">
          Sin materiales cargados.
        </p>
      ) : (
        <div className="space-y-3">
          {materiales.map(detalle => {
            const subtotal =
              Number(detalle.cantidad) *
              Number(detalle.precioUnitario)

            return (
              <div
                key={detalle.id}
                className="flex justify-between items-start text-[13px]"
              >
                <div>
                  <p className="text-[#333] font-medium">
                    {detalle.material.nombre}
                  </p>

                  <p className="text-[#6B7280] text-[12px]">
                    {detalle.cantidad} {detalle.unidadDeMedida}
                    {' × $'}
                    {detalle.precioUnitario}
                  </p>
                </div>

                <span className="text-[#333] font-bold">
                  ${subtotal.toLocaleString()}
                </span>
              </div>
            )
          })}

          <div className="border-t border-black/[0.08] pt-3 flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#A44A3F]">
              Total
            </span>

            <span className="text-[#333] font-bold">
              ${totalMateriales.toLocaleString()}
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
  + Agregar material
</button>
      )}
    </div>
  )
}