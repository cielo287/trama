import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

interface Props {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel()
      }}
    >
<DialogContent
  showCloseButton={false}
    onEscapeKeyDown={(e) => {
    e.preventDefault()           // evita que Radix cierre el dialog
    e.stopPropagation()
    onCancel()                   // vos manejás el cierre
  }}
  onKeyDown={(e) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    if (e.key === 'Enter' && !loading) {
      e.preventDefault()
      onConfirm()
    }
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

        <div className="px-6 py-5 border-b border-black/[0.06]">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#A44A3F] font-bold">
            Confirmación_
          </p>
        </div>

        <div className="px-6 py-6 space-y-4">
          <h3 className="text-[18px] font-bold tracking-tight text-[#333]">
            {title}
          </h3>

          <p className="text-[13px] leading-relaxed text-[#6B7280]">
            {message}
          </p>
        </div>

        <div className="px-6 py-5 border-t border-black/[0.06] flex justify-end gap-3 bg-gray-50/40">
          <button
            type="button"
            onClick={onCancel}
            className="
              text-[10px]
              uppercase
              tracking-[0.15em]
              font-bold
              text-[#6B7280]
              hover:text-[#333]
            "
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="
              px-4
              py-2.5
              bg-[#A44A3F]
              text-white
              text-[10px]
              uppercase
              tracking-[0.15em]
              font-bold
              disabled:opacity-50
            "
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}