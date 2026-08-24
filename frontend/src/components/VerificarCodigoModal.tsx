import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/input'

interface Props {
  open: boolean
  email: string
  onVerificado: () => void
}

export default function VerificarCodigoModal({ open, email, onVerificado }: Props) {
  const { verificarCodigo, reenviarCodigo, actionLoading, error, errorCode } = useAuth()
  const [codigo, setCodigo] = useState('')
  const [mensajeReenvio, setMensajeReenvio] = useState<string | null>(null)
  const codigoBloqueado = errorCode === 'CODIGO_BLOQUEADO'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await verificarCodigo(email, codigo)
      onVerificado()
    } catch {
      setCodigo('')
    }
  }

  async function handleReenviar() {
    setMensajeReenvio(null)
    try {
      await reenviarCodigo(email)
      setMensajeReenvio('Te reenviamos el código')
    } catch {
      // el error ya quedó seteado en el contexto
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-[440px] bg-white p-10 md:p-12 shadow-xl relative rounded-sm">

        <p className="font-mono text-[13px] text-[#6B7280] uppercase tracking-[0.4em] mb-4">
          Verificá tu cuenta
        </p>
        <p className="font-mono text-[12px] text-[#4B5563] mb-10">
          Te mandamos un código de 6 dígitos a <span className="font-bold">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="space-y-1 group">
            <label className="block font-mono text-[12px] text-[#4B5563] uppercase tracking-widest font-bold group-focus-within:text-[#A44A3F] transition-colors">
              Código
            </label>
            <Input
              value={codigo}
              onChange={e => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="field-input w-full text-center tracking-[0.5em] text-lg"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              required
              disabled={codigoBloqueado}
            />
          </div>

          {error && (
            <p className="font-mono text-[11px] text-red-600 tracking-wide">{error}</p>
          )}
          {mensajeReenvio && (
            <p className="font-mono text-[11px] text-[#A44A3F] tracking-wide">{mensajeReenvio}</p>
          )}

          <div className="pt-2 space-y-4">
            <div className="h-0.75 w-full bg-[#A44A3F] opacity-90" />
          <button
            type="submit"
            disabled={actionLoading || codigo.length !== 6 || codigoBloqueado}
            className="w-full bg-[#A44A3F] text-white py-4 text-[15px] font-bold uppercase tracking-[0.25em] shadow-xl shadow-[#A44A3F]/20 hover:bg-[#8e3f35] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {actionLoading ? 'Verificando...' : codigoBloqueado ? 'Bloqueado' : 'Verificar'}
          </button>
          </div>
        </form>

        <button
          type="button"
          onClick={handleReenviar}
          disabled={actionLoading || codigoBloqueado}
          className="mt-8 font-mono text-[11px] text-[#1F2937] uppercase tracking-tighter font-bold hover:text-[#A44A3F] disabled:opacity-50"
        >
           Reenviar código
        </button>

      </div>
    </div>
  )
}