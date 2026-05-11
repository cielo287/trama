import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: (nombre: string) => Promise<void>
  loading: boolean
}

export default function NuevaObraModal({ open, onClose, onConfirm, loading }: Props) {
  const [nombre, setNombre] = useState('')

  async function handleConfirm() {
    if (!nombre.trim()) return
    await onConfirm(nombre.trim())
    setNombre('')
    onClose()
  }

  function handleCancel() {
    setNombre('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="bg-[#F8F6F1]/90 backdrop-blur-md border-none shadow-none max-w-md flex flex-col items-center gap-0 p-10 [&>button]:hidden">

        <p className="font-mono text-[10px] text-[#A44A3F] uppercase tracking-[0.3em] font-bold mb-4 text-center">
          Nombre de la nueva obra_
        </p>

        <input
          type="text"
          autoComplete="off"
          placeholder="Ej: Edificio Alvear"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleConfirm()}
          autoFocus
          className="w-full bg-transparent border-b-2 border-[#A44A3F] py-4 text-2xl font-light tracking-tighter text-[#333333] outline-none focus:border-[#A44A3F] transition-all text-center placeholder:text-gray-300"
        />

        <div className="flex items-center gap-8 pt-6">
          <button
            onClick={handleConfirm}
            disabled={loading || !nombre.trim()}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer active:scale-95 transition-transform disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-full bg-[#A44A3F] flex items-center justify-center shadow-[0_4px_12px_rgba(164,74,63,0.25)]">
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-mono text-[10px] font-bold tracking-widest text-[#333333] uppercase">
              {loading ? 'Guardando...' : 'Confirmar'}
            </span>
          </button>

          <button
            onClick={handleCancel}
            className="font-mono text-[10px] font-bold tracking-widest text-gray-500 uppercase italic opacity-50 hover:opacity-100 transition-opacity"
          >
            Cancelar
          </button>
        </div>

      </DialogContent>
    </Dialog>
  )
}