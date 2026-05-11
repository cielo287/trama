import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const { login, actionLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="relative min-h-screen bg-[#F8F6F1] flex items-center overflow-hidden">

      <style>{`
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-logo { animation: fade-in 1s ease 0.2s both; }
        .anim-card { animation: slide-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
        .field:focus-within .field-label { color: #A44A3F; }
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

      {/* Líneas de fondo */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.18]">
        <line x1="-5%" y1="28%" x2="108%" y2="78%"
          stroke="#6B7280" strokeWidth="1" strokeDasharray="1400" strokeDashoffset="1400"
          style={{ animation: 'draw 2.8s ease-out 0.2s forwards' }} />
        <line x1="108%" y1="8%" x2="-5%" y2="92%"
          stroke="#6B7280" strokeWidth="1" strokeDasharray="1400" strokeDashoffset="1400"
          style={{ animation: 'draw 2.8s ease-out 0.6s forwards' }} />
        <line x1="39%" y1="-5%" x2="43%" y2="108%"
          stroke="#6B7280" strokeWidth="1" strokeDasharray="1400" strokeDashoffset="1400"
          style={{ animation: 'draw 2.8s ease-out 1s forwards' }} />
      </svg>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-12 flex items-center">

        {/* Logo */}
        <div className="anim-logo flex-1 flex items-center">
          <div className="relative -translate-y-10">
            {/* Líneas cruzadas detrás del logo */}
            <div className="absolute inset-0 flex items-center justify-center -m-16 opacity-[0.22] pointer-events-none">
              <div className="absolute w-px h-96 bg-gray-400 rotate-12" />
              <div className="absolute h-px w-96 bg-gray-400 -rotate-3" />
            </div>
            <h1
              className="relative leading-none tracking-tighter whitespace-nowrap text-[#333333]"
              style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 'clamp(80px, 10vw, 148px)', fontWeight: 200 }}
            >
              trama.
            </h1>
          </div>
        </div>
        

        {/* Card */}
<div className="anim-card w-full max-w-[400px] mt-12 md:mt-0 md:ml-auto md:mr-16">
  <div className="bg-white/30 backdrop-blur-md border border-gray-200/50 p-10 md:p-14 shadow-[30px_30px_60px_-15px_rgba(0,0,0,0.07)] relative rounded-sm">
    
    <div className="absolute -top-px -left-px w-6 h-6 border-l border-t border-gray-400" />
    
    <p className="font-mono text-[13px] text-[#6B7280] uppercase tracking-[0.4em] mb-14">
      Ingreso al estudio
    </p>

    <form onSubmit={handleSubmit} className="space-y-12">

      <div className="space-y-1 group">
        <label className="block font-mono text-[12px] text-[#4B5563] uppercase tracking-widest font-bold group-focus-within:text-[#A44A3F] transition-colors">
          Email
        </label>
        <Input
          type="email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="field-input w-full bg-transparent border-b border-[#333333] py-2 text-base outline-none focus:border-[#A44A3F] transition-all"
        />
      </div>

      <div className="space-y-1 group">
        <label className="block font-mono text-[12px] text-[#4B5563] uppercase tracking-widest font-bold group-focus-within:text-[#A44A3F] transition-colors">
          Contraseña
        </label>
        <Input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="field-input w-full bg-transparent border-b border-[#333333] py-2 text-base outline-none focus:border-[#A44A3F] transition-all"
        />
      </div>

      {error && (
        <p className="font-mono text-[11px] text-red-600 tracking-wide">{error}</p>
      )}

      <div className="pt-6 space-y-5">
        <div className="h-[3px] w-full bg-[#A44A3F] opacity-90" />
        <button
          type="submit"
          disabled={actionLoading}
          className="w-full bg-[#A44A3F] text-white py-4 text-[15px] font-bold uppercase tracking-[0.25em] shadow-xl shadow-[#A44A3F]/20 hover:bg-[#8e3f35] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {actionLoading ? 'Ingresando...' : 'Entrar'}
        </button>
      </div>

    </form>

    <div className="mt-12 flex justify-between items-center opacity-90 hover:opacity-100 transition-opacity">
      <a href="#" className="font-mono text-[11px] text-[#1F2937] uppercase tracking-tighter font-bold hover:text-[#A44A3F]">
        ¿Olvidaste el acceso?
      </a>
      <div className="h-3 w-px bg-gray-400" />
      <a href="#" className="font-mono text-[11px] text-[#1F2937] uppercase tracking-tighter font-bold hover:text-[#A44A3F]">
        Crear cuenta
      </a>
    </div>

  </div>
</div>

      </div>
    </div>
  )
}