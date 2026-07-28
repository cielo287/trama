import { useRef, useEffect } from 'react'
import type { TareaConAlerta } from '@/types'

interface Props {
  alertas: TareaConAlerta[]
  loading: boolean
  onResponder: (tareaId: number, termino: boolean) => void
  //onClose: () => void
}

export default function AlertasFinPanel({ alertas, loading, onResponder }: Props) {
  const ref = useRef<HTMLDivElement>(null)



  return (
    <div
      className="absolute right-0 top-11 z-[9999] w-[340px] bg-white border border-black/[0.08] rounded-sm shadow-lg overflow-hidden"
    >
      <div className="px-4 py-2.5 border-b border-black/[0.06]">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#6B7280] font-bold">
          Confirmar finalización
        </p>
      </div>

      {alertas.length === 0 ? (
        <p className="px-4 py-6 text-center font-mono text-[11px] text-[#8C8076]">
          No hay tareas pendientes
        </p>
      ) : (
        <ul className="max-h-[360px] overflow-y-auto">
          {alertas.map(tarea => (
            <li key={tarea.id} className="px-4 py-3 border-b border-black/[0.05] last:border-0">
              <p className="text-[13px] text-[#333333] leading-snug">
                <span className="font-semibold">{tarea.titulo}</span>, a realizar por{' '}
                <span className="font-semibold">
                    {tarea.manoDeObra?.[0]?.encargado
                    ? `${tarea.manoDeObra[0].encargado.nombre} ${tarea.manoDeObra[0].encargado.apellido}`
                    : 'sin encargado'}
                </span>{' '}
                tenía fecha de finalización el día{' '}
               <span className="font-semibold">
                {new Date(tarea.finAjustado).toLocaleDateString('es-AR')}
                </span>. ¿Esta tarea finalizó?
              </p>
              <div className="flex gap-2 mt-2.5">
                <button
                  disabled={loading}
                  onClick={() => onResponder(tarea.id, true)}
                  className="flex-1 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-sm bg-[#A44A3F] text-white hover:bg-[#8f3f35] disabled:opacity-50 transition-colors"
                >
                  Sí
                </button>
                <button
                  disabled={loading}
                  onClick={() => onResponder(tarea.id, false)}
                  className="flex-1 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-sm border border-black/[0.1] text-[#6B7280] hover:bg-black/[0.03] disabled:opacity-50 transition-colors"
                >
                  No
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}