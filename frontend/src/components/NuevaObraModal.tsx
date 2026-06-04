import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { CreateObraInput } from '@/types/inputs'


interface Props {
  open: boolean
  onClose: () => void
  onConfirm: (data: CreateObraInput) => Promise<void>
  loading: boolean

  initialData?: CreateObraInput
  titulo?: string
}

export default function NuevaObraModal({
  open,
  onClose,
  onConfirm,
  loading,
  initialData,
  titulo = 'Nueva obra_',
}: Props) {
const [nombre, setNombre] = useState(initialData?.nombre ?? '')
const [direccion, setDireccion] = useState(initialData?.direccion ?? '')
const [cliente, setCliente] = useState(initialData?.cliente ?? '')

useEffect(() => {
  setNombre(initialData?.nombre ?? '')
  setDireccion(initialData?.direccion ?? '')
  setCliente(initialData?.cliente ?? '')
}, [initialData, open])

  async function handleConfirm() {
    if (!nombre.trim()) return

    await onConfirm({
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      cliente: cliente.trim(),
    })

    setNombre('')
    setDireccion('')
    setCliente('')

    onClose()
  }

  function handleCancel() {
    setNombre('')
    setDireccion('')
    setCliente('')

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="bg-[#F8F6F1]/90 backdrop-blur-md border-none shadow-none max-w-md flex flex-col gap-4 p-10 [&>button]:hidden">

    <p className="font-mono text-[10px] text-[#A44A3F] uppercase tracking-[0.3em] font-bold text-center">
        {titulo}
    </p>

        <input
          type="text"
          placeholder="Nombre de la obra"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          autoFocus
          className="w-full bg-transparent border-b border-[#A44A3F] py-3 text-xl font-light text-center outline-none"
        />

        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={e => setDireccion(e.target.value)}
          className="w-full bg-transparent border-b border-black/20 py-2 text-sm outline-none"
        />

        <input
          type="text"
          placeholder="Cliente"
          value={cliente}
          onChange={e => setCliente(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleConfirm()
            }
          }}
          className="w-full bg-transparent border-b border-black/20 py-2 text-sm outline-none"
        />

        <div className="flex items-center gap-8 pt-4">
          <button
            onClick={handleConfirm}
            disabled={loading || !nombre.trim()}
            className="flex items-center gap-2 bg-transparent border-none cursor-pointer active:scale-95 transition-transform disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-full bg-[#A44A3F] flex items-center justify-center">
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path
                  d="M1 5L4.5 8.5L11 1.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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