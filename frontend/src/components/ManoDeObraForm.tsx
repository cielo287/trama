import { useState } from 'react'
import type { CreateManoDeObraInput } from '@/types/inputs'
import { useEncargados } from '@/hooks/useEncargado'
import ComboboxCreatable from './ComboCreatable'

interface EncargadoOption {
  id: number
  label: string
  nombre: string
  apellido: string
  telefono: string
}



interface Props {
    initialData?: {
    nombre: string
    apellido: string
    telefono: string
    precio: number
    //codigoPais: string
    //codigoArea: string
    //numero: string
  }
  onCancel: () => void
  onSave: (
    data: CreateManoDeObraInput
  ) => void | Promise<void>
}

export default function ManoDeObraForm({
  onCancel,
  onSave,
  initialData,
}: Props) {
  const [nombre, setNombre] = useState(initialData?.nombre ?? '')
  const [apellido, setApellido] = useState(initialData?.apellido ?? '')
  const [precio, setPrecio] = useState(initialData?.precio ?? 0)
  const [loading, setLoading] = useState(false)
  const [codigoPais, setCodigoPais] = useState('+54 9')
  const [codigoArea, setCodigoArea] = useState('')
  const [numero, setNumero] = useState('')

const [nombreCompleto, setNombreCompleto] = useState(
  initialData ? `${initialData.nombre} ${initialData.apellido}`.trim() : ''
)

const handleSave = async () => {
  if (!nombreCompleto.trim() || loading) return

  const [nombre, ...resto] = nombreCompleto.trim().split(' ')
  const apellido = resto.join(' ')

  setLoading(true)
  try {
    await onSave({
      nombre,
      apellido,
      telefono: `${codigoPais}${codigoArea}${numero}`.replace(/\D/g, ''),
      precio,
    })
  } finally {
    setLoading(false)
  }
}

const { encargado } = useEncargados()
 
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
      <div className="col-span-2">
<ComboboxCreatable<EncargadoOption>
  label="Encargado"
  placeholder="Juan Pérez"
  value={nombreCompleto}
  onChange={setNombreCompleto}
  onSelect={opt => {
    setNombreCompleto(`${opt.nombre} ${opt.apellido}`)
    setCodigoPais('')
    setCodigoArea('')
    setNumero(opt.telefono)
  }}
  options={encargado.map(e => ({
    id: e.id,
    label: `${e.nombre} ${e.apellido}`,
    nombre: e.nombre,
    apellido: e.apellido,
    telefono: e.telefono,
  }))}
/>

<div className="col-span-2">
  <label className="block text-[10px] uppercase tracking-[0.15em] text-[#6B7280] mb-1">
    Teléfono
  </label>

  <div className="flex items-center gap-1.5">
  <input
    value={codigoPais}
    onChange={e => setCodigoPais(e.target.value.replace(/[^\d+\s]/g, ''))}
    placeholder="+54 9"
    className="
      w-[52px]
      border
      border-black/10
      rounded-sm
      px-1.5
      py-1.5
      text-[12px]
      text-center
      outline-none
      focus:border-[#A44A3F]
    "
  />

  <input
    value={codigoArea}
    onChange={e => setCodigoArea(e.target.value.replace(/\D/g, ''))}
    placeholder="351"
    inputMode="numeric"
    className="
      w-[48px]
      border
      border-black/10
      rounded-sm
      px-1.5
      py-1.5
      text-[12px]
      text-center
      outline-none
      focus:border-[#A44A3F]
    "
  />

  <input
    value={numero}
    onChange={e => setNumero(e.target.value.replace(/\D/g, ''))}
    placeholder="4524851"
    inputMode="numeric"
    className="
      flex-1
      min-w-0
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