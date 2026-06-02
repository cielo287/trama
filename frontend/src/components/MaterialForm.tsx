import { useState } from 'react'
import { CreateDetalleMaterialInput } from "@/types/inputs"

interface Props {
  onCancel: () => void
  onSave: (data: CreateDetalleMaterialInput) => void | Promise<void>
}

export default function MaterialForm({
  onCancel,
  onSave,
}: Props) {
  const [nombre, setNombre] = useState('')
  const [cantidad, setCantidad] = useState(0)
  const [precioUnitario, setPrecioUnitario] = useState(0)
  const [unidadDeMedida, setUnidadDeMedida] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    console.log({ nombre, cantidad, precioUnitario, unidadDeMedida })
    if (!nombre.trim() || loading) return

    setLoading(true)
    try {
      await onSave({
        nombre,
        cantidad,
        precioUnitario,
        unidadDeMedida,
      })
    } finally {
      setLoading(false)
    }
  }

return (
  <div
    className="space-y-3"
    onKeyDown={e => {
      if (e.key === 'Enter') {
        e.stopPropagation()
        // Si además querés que Enter guarde la MDO:
        handleSave()
      }
    }}
  >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-[#6B7280] mb-1">
            Material
          </label>
          <input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Cemento"
            className="
              w-full
              border
              border-black/10
              rounded-sm
              px-2
              py-1.5
              text-[13px]
              outline-none
              focus:border-[#A44A3F]
            "
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-[#6B7280] mb-1">
            Unidad
          </label>
          <input
            value={unidadDeMedida}
            onChange={e => setUnidadDeMedida(e.target.value)}
            placeholder="kg, m², u"
            className="
              w-full
              border
              border-black/10
              rounded-sm
              px-2
              py-1.5
              text-[13px]
              outline-none
              focus:border-[#A44A3F]
            "
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-[#6B7280] mb-1">
            Cantidad
          </label>
          <input
            type="number"
            value={cantidad}
            onChange={e => setCantidad(Number(e.target.value))}
            placeholder="0"
            className="
              w-full
              border
              border-black/10
              rounded-sm
              px-2
              py-1.5
              text-[13px]
              outline-none
              focus:border-[#A44A3F]
            "
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-[#6B7280] mb-1">
            Precio unit.
          </label>
          <input
            type="number"
            value={precioUnitario}
            onChange={e => setPrecioUnitario(Number(e.target.value))}
            placeholder="0"
            className="
              w-full
              border
              border-black/10
              rounded-sm
              px-2
              py-1.5
              text-[13px]
              outline-none
              focus:border-[#A44A3F]
            "
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-1">
<button
  type="button"
  onClick={handleSave}
  disabled={loading}
  className="
    flex items-center gap-2
    text-[#A44A3F]
    hover:opacity-60
    transition-opacity
    disabled:opacity-40
  "
>
  {loading ? (
    <svg
      className="animate-spin"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
      <path
        d="M3.5 6.2L5.2 8L8.8 4.3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )}

  <span className="text-[11px] uppercase tracking-[0.2em] font-bold">
    {loading ? 'Guardando...' : 'Guardar'}
  </span>
</button>

        <button
          type="button"
          onClick={onCancel}
          className="
            text-[11px]
            italic
            uppercase
            tracking-[0.15em]
            text-[#6B7280]
            hover:text-[#333]
          "
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}