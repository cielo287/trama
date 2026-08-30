import { useState } from 'react'
import { solicitarRecuperacion } from '@/api/auth'
import { Input } from '@/components/ui/input'

interface Props {
  open: boolean
  onClose: () => void
}

export default function ForgotPasswordModal({ open, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await solicitarRecuperacion(email)
    } catch {

    } finally {
      setLoading(false)
      setEnviado(true)
    }
  }

  function handleClose() {
    setEmail('')
    setEnviado(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white/95 border border-gray-200/40 p-10 md:p-14 shadow-xl relative rounded-sm w-full max-w-[400px] mx-4">
        <div className="absolute -top-px -left-px w-6 h-6 border-l border-t border-gray-400" />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#A44A3F] font-mono text-sm"
        >
          ✕
        </button>

        {enviado ? (
          <div className="text-center">
            <p className="font-mono text-[13px] text-[#6B7280] uppercase tracking-[0.4em] mb-6">
              Revisá tu mail
            </p>
            <p className="font-mono text-[13px] text-[#4B5563]">
              Si el email existe, te enviamos un link para restablecer tu contraseña.
            </p>
          </div>
        ) : (
          <>
            <p className="font-mono text-[13px] text-[#6B7280] uppercase tracking-[0.4em] mb-10">
              Recuperar acceso
            </p>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-1 group">
                <label className="block font-mono text-[12px] text-[#4B5563] uppercase tracking-widest font-bold group-focus-within:text-[#A44A3F] transition-colors">
                  Email
                </label>
                <Input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field-input w-full bg-transparent border-b border-[#333333] py-2 text-base outline-none focus:border-[#A44A3F] transition-all font-mono"
                />
              </div>

              <div className="pt-2 space-y-5">
                <div className="h-[3px] w-full bg-[#A44A3F] opacity-90" />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#A44A3F] text-white py-4 text-[15px] font-bold uppercase tracking-[0.25em] shadow-xl shadow-[#A44A3F]/20 hover:bg-[#8e3f35] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar link'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}