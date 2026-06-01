import { useState } from 'react'
import type { CreateManoDeObraInput } from '@/types/inputs'

interface Props {
  onCancel: () => void
  onSave: (
    data: CreateManoDeObraInput
  ) => void | Promise<void>
}

export default function ManoDeObraForm({
  onCancel,
  onSave,
}: Props) {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [telefono, setTelefono] = useState('')
  const [precio, setPrecio] = useState(0)

  const handleSave = async () => {
    if (!nombre.trim()) return

    await onSave({
      nombre,
      apellido,
      telefono,
      precio,
    })
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.15em] text-[#6B7280] mb-1">
            Nombre
          </label>

          <input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Juan"
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
            Apellido
          </label>

          <input
            value={apellido}
            onChange={e => setApellido(e.target.value)}
            placeholder="Pérez"
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
            Teléfono
          </label>

          <input
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            placeholder="351..."
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
            Precio
          </label>

          <input
            type="number"
            value={precio}
            onChange={e => setPrecio(Number(e.target.value))}
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
          className="
            flex items-center gap-2
            text-[#A44A3F]
            hover:opacity-60
            transition-opacity
          "
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <circle
              cx="6"
              cy="6"
              r="5.5"
              stroke="currentColor"
            />
            <path
              d="M3.5 6.2L5.2 8L8.8 4.3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-[11px] uppercase tracking-[0.2em] font-bold">
            Guardar
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