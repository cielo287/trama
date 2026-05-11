import { useAuth } from '@/context/AuthContext'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'


export default function Header() {
  const { state, logout } = useAuth()

const nombre = state.status === 'authenticated' ? state.usuario.nombre : ''
const inicial = nombre ? nombre.charAt(0).toUpperCase() : '?'

  return (
    <header className="flex justify-between items-center px-8 py-6 border-b border-gray-300/50 bg-white/30 backdrop-blur-sm sticky top-0 z-20">
      <h2
        className="text-4xl font-light text-[#333333] tracking-tighter"
        style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
      >
        trama.
      </h2>

      <div className="flex items-center gap-4">
        <div className="text-left hidden sm:block">
          <p className="font-mono text-[15px] text-[#6B7280] uppercase tracking-widest leading-none">
            Estudio
          </p>
          <p className="text-base font-bold text-[#333333] uppercase tracking-tight">
            {nombre}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-12 h-12 border border-[#333333] flex items-center justify-center bg-white rounded-sm text-xs font-mono font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:border-[#A44A3F] hover:text-[#A44A3F] transition-colors">
              {inicial}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="font-mono text-xs">
            <DropdownMenuItem className="tracking-wide uppercase text-[11px] cursor-pointer">
              Mi perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="tracking-wide uppercase text-[11px] text-[#A44A3F] cursor-pointer"
            >
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}