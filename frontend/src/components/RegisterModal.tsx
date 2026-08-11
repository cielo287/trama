import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/input'

interface Props {
  open: boolean
  onClose: () => void
  onRegistroExitoso: (email: string) => void
}

export default function RegisterModal({ open, onClose, onRegistroExitoso }: Props) {
  const { register, actionLoading, error } = useAuth()
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorLocal, setErrorLocal] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorLocal(null)

    if (password != confirmPassword) {
      setErrorLocal('Las contraseñas no coinciden')
      return
    }

    try {
      await register({ nombre, apellido, email, password })
      onRegistroExitoso(email)
    } catch {
      // el error ya quedó seteado en el contexto, no cerramos
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-[440px] bg-white p-10 md:p-12 shadow-xl relative rounded-sm">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6B7280] hover:text-[#A44A3F] text-xl leading-none"
          aria-label="Cerrar"
        >
          ×
        </button>

        <p className="font-mono text-[13px] text-[#6B7280] uppercase tracking-[0.4em] mb-10">
          Crear cuenta
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1 group">
              <label className="block font-mono text-[12px] text-[#4B5563] uppercase tracking-widest font-bold group-focus-within:text-[#A44A3F] transition-colors">
                Nombre
              </label>
              <Input
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="field-input w-full"
                required
              />
            </div>

            <div className="space-y-1 group">
              <label className="block font-mono text-[12px] text-[#4B5563] uppercase tracking-widest font-bold group-focus-within:text-[#A44A3F] transition-colors">
                Apellido
              </label>
              <Input
                value={apellido}
                onChange={e => setApellido(e.target.value)}
                className="field-input w-full"
                required
              />
            </div>
          </div>

          <div className="space-y-1 group">
            <label className="block font-mono text-[12px] text-[#4B5563] uppercase tracking-widest font-bold group-focus-within:text-[#A44A3F] transition-colors">
              Email
            </label>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="field-input w-full"
              required
            />
          </div>

          <div className="space-y-1 group">
            <label className="block font-mono text-[12px] text-[#4B5563] uppercase tracking-widest font-bold group-focus-within:text-[#A44A3F] transition-colors">
              Contraseña
            </label>
            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="field-input w-full"
              required
            />
          </div>
          <div className="space-y-1 group">
  <label className="block font-mono text-[12px] text-[#4B5563] uppercase tracking-widest font-bold group-focus-within:text-[#A44A3F] transition-colors">
    Confirmar contraseña
  </label>
  <Input
    type="password"
    autoComplete="new-password"
    value={confirmPassword}
    onChange={e => setConfirmPassword(e.target.value)}
    className="field-input w-full"
    required
  />
</div>

       {(errorLocal || error) && (
  <p className="font-mono text-[11px] text-red-600 tracking-wide">{errorLocal || error}</p>
)}

          <div className="pt-2 space-y-4">
            <div className="h-[3px] w-full bg-[#A44A3F] opacity-90" />
            <button
              type="submit"
              disabled={actionLoading}
              className="w-full bg-[#A44A3F] text-white py-4 text-[15px] font-bold uppercase tracking-[0.25em] shadow-xl shadow-[#A44A3F]/20 hover:bg-[#8e3f35] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {actionLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}