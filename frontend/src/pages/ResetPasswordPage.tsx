// pages/ResetPasswordPage.tsx
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { resetearPassword } from '@/api/auth'
import { Input } from '@/components/ui/input'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)
    try {
      await resetearPassword(token!, password)
      setExito(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      setError(err.message || 'El link expiró o es inválido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#F8F6F1] flex items-center justify-center overflow-hidden">
      <style>{`
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-card { animation: slide-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
        .field-input {
          background: transparent !important;
          border: none !important;
          border-bottom: 1.5px solid #333 !important;
          border-radius: 0 !important;
          padding: 8px 0 !important;
          font-size: 15px !important;
          height: auto !important;
          box-shadow: none !important;
        }
        .field-input:focus { border-color: #A44A3F !important; box-shadow: none !important; }
      `}</style>

      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.18]">
        <line x1="-5%" y1="28%" x2="108%" y2="78%"
          stroke="#6B7280" strokeWidth="1" strokeDasharray="1400" strokeDashoffset="1400"
          style={{ animation: 'draw 2.8s ease-out 0.2s forwards' }} />
        <line x1="108%" y1="8%" x2="-5%" y2="92%"
          stroke="#6B7280" strokeWidth="1" strokeDasharray="1400" strokeDashoffset="1400"
          style={{ animation: 'draw 2.8s ease-out 0.6s forwards' }} />
      </svg>

      <div className="anim-card relative z-10 w-full max-w-[400px] mx-4">
        <div className="bg-white/20 backdrop-blur-sm border border-gray-200/40 p-10 md:p-14 shadow-[20px_20px_40px_-20px_rgba(0,0,0,0.08)] relative rounded-sm">
          <div className="absolute -top-px -left-px w-6 h-6 border-l border-t border-gray-400" />

          {!token ? (
            <div className="text-center">
              <p className="font-mono text-[13px] text-[#6B7280] uppercase tracking-[0.4em] mb-6">
                Link inválido
              </p>
              <p className="font-mono text-[13px] text-[#4B5563]">
                Solicitá un nuevo link de recuperación desde el login.
              </p>
            </div>
          ) : exito ? (
            <div className="text-center">
              <p className="font-mono text-[13px] text-[#6B7280] uppercase tracking-[0.4em] mb-6">
                Listo
              </p>
              <p className="font-mono text-[13px] text-[#4B5563]">
                Contraseña actualizada. Redirigiendo al login...
              </p>
            </div>
          ) : (
            <>
              <p className="font-mono text-[13px] text-[#6B7280] uppercase tracking-[0.4em] mb-14">
                Nueva contraseña
              </p>

              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="space-y-1 group">
                  <label className="block font-mono text-[12px] text-[#4B5563] uppercase tracking-widest font-bold group-focus-within:text-[#A44A3F] transition-colors">
                    Contraseña
                  </label>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="field-input w-full bg-transparent border-b border-[#333333] py-2 text-base outline-none focus:border-[#A44A3F] transition-all font-mono"
                  />
                </div>

                <div className="space-y-1 group">
                  <label className="block font-mono text-[12px] text-[#4B5563] uppercase tracking-widest font-bold group-focus-within:text-[#A44A3F] transition-colors">
                    Confirmar contraseña
                  </label>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    className="field-input w-full bg-transparent border-b border-[#333333] py-2 text-base outline-none focus:border-[#A44A3F] transition-all font-mono"
                  />
                </div>

                {error && (
                  <p className="font-mono text-[11px] text-red-600 tracking-wide">{error}</p>
                )}

                <div className="pt-6 space-y-5">
                  <div className="h-[3px] w-full bg-[#A44A3F] opacity-90" />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#A44A3F] text-white py-4 text-[15px] font-bold uppercase tracking-[0.25em] shadow-xl shadow-[#A44A3F]/20 hover:bg-[#8e3f35] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Guardando...' : 'Restablecer contraseña'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}