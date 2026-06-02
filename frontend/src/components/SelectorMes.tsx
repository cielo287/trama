import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Props {
  fecha: Date
  onChange: (fecha: Date) => void
}

export default function SelectorMes({
  fecha,
  onChange
}: Props) {

  const mesLabel = format(
    fecha,
    'MMMM yyyy',
    { locale: es }
  ).replace(/^\w/, c => c.toUpperCase())

  const navegarMes = (
    direccion: 'prev' | 'next'
  ) => {
    onChange(
      new Date(
        fecha.getFullYear(),
        fecha.getMonth() +
          (direccion === 'next' ? 1 : -1),
        1
      )
    )
  }

  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md border border-black/[0.05]">

      <button
        onClick={() => navegarMes('prev')}
        className="px-3 py-1.5 text-[10px] font-bold rounded-sm transition-all text-gray-400 hover:text-[#A44A3F] hover:bg-white hover:shadow-sm"
      >
        ←
      </button>

      <div className="px-4 py-1.5 min-w-[140px] text-center text-[10px] uppercase tracking-widest font-bold text-[#374151]">
        {mesLabel}
      </div>

      <button
        onClick={() => navegarMes('next')}
        className="px-3 py-1.5 text-[10px] font-bold rounded-sm transition-all text-gray-400 hover:text-[#A44A3F] hover:bg-white hover:shadow-sm"
      >
        →
      </button>

    </div>
  )
}