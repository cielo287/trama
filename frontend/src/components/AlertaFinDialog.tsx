import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import type { Tarea } from '@/types'

interface Props {
  open: boolean
  tarea: Tarea | null
  restantes: number
  loading?: boolean
  onSi: () => void
  onNo: () => void
}

export default function AlertaFinDialog({
  open,
  tarea,
  restantes,
  loading = false,
  onSi,
  onNo,
}: Props) {
  if (!tarea) return null

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onKeyDown={(e) => {
          e.stopPropagation()
          e.nativeEvent.stopImmediatePropagation()
        }}
        className="
          p-0
          gap-0
          max-w-[420px]
          border-black/[0.08]
          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
          font-mono
          rounded-none
          bg-white
        "
      >
        <div className="h-1 bg-[#A44A3F]" />
        <div className="px-6 py-5 border-b border-black/[0.06] flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#A44A3F] font-bold">
            Confirmación de tarea_
          </p>
          {restantes > 1 && (
            <p className="text-[9px] uppercase tracking-wider text-gray-400">
              +{restantes - 1} pendiente{restantes - 1 === 1 ? '' : 's'}
            </p>
          )}
        </div>
        <div className="px-6 py-6 space-y-4">
          <h3 className="text-[18px] font-bold tracking-tight text-[#333]">
            {tarea.titulo}
          </h3>
          <p className="text-[13px] leading-relaxed text-[#6B7280]">
            La fecha de fin planificada ya pasó. ¿Esta tarea ya terminó?
          </p>
        </div>
        <div className="px-6 py-5 border-t border-black/[0.06] flex justify-end gap-3 bg-gray-50/40">
          <button
            type="button"
            onClick={onNo}
            className="
              px-4
              py-2.5
              border
              border-black/[0.12]
              text-[#6B7280]
              text-[10px]
              uppercase
              tracking-[0.15em]
              font-bold
              hover:bg-black/[0.03]
            "
          >
            Todavía no
          </button>
          <button
            type="button"
            onClick={onSi}
            className="
              px-4
              py-2.5
              bg-[#A44A3F]
              text-white
              text-[10px]
              uppercase
              tracking-[0.15em]
              font-bold
            "
          >
            Sí, terminó
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}