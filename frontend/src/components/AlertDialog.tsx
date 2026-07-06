import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

interface Props {
  open: boolean
  title: string
  message: string
  buttonText?: string
  onClose: () => void
}

export default function AlertDialog({
  open,
  title,
  message,
  buttonText = 'Aceptar',
  onClose,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onClose()
        }}
        onKeyDown={(e) => {
          e.stopPropagation()
          e.nativeEvent.stopImmediatePropagation()

          if (e.key === 'Enter') {
            e.preventDefault()
            onClose()
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
            Aviso_
          </p>
        </div>

        <div className="px-6 py-6 space-y-4">
          <h3 className="text-[18px] font-bold tracking-tight text-[#333]">
            {title}
          </h3>

          <p className="text-[13px] leading-relaxed text-[#6B7280] whitespace-pre-wrap">
            {message}
          </p>
        </div>

        <div className="px-6 py-5 border-t border-black/[0.06] flex justify-end bg-gray-50/40">
          <button
            type="button"
            onClick={onClose}
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
            {buttonText}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}