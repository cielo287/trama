import { useState } from 'react'
import { useObras } from '@/hooks/useObras'
import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header'
import NuevaObraModal from '@/components/NuevaObraModal'
import { useNavigate } from 'react-router-dom'

export default function ObrasPage() {
  const { obras, loading, actionLoading, crear } = useObras()
  const { state } = useAuth()
  const nombre = state.status === 'authenticated' ? state.usuario.nombre : ''
  const [modalAbierto, setModalAbierto] = useState(false)

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-[#F8F6F1]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#6B7280]">
            Cargando...
          </p>
        </div>
      </div>
    )
  }
  

  return (
    <div className="h-screen flex flex-col bg-[#F8F6F1]">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-8 py-12">
          {obras.length === 0
            ? <ObrasVacia nombre={nombre} onNuevaObra={() => setModalAbierto(true)} />
            : <ObrasLista obras={obras} />}
        </div>
      </main>

      {obras.length > 0 && (
        <button
          onClick={() => setModalAbierto(true)}
          className="fixed bottom-30 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#A44A3F] rounded-full flex items-center justify-center transition-transform hover:scale-110 hover:bg-[#8e3f35] shadow-xl shadow-[#A44A3F]/30 active:scale-95 z-50"
        >
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
            <line x1="7" y1="1" x2="7" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="1" y1="7" x2="13" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}

      <NuevaObraModal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onConfirm={crear}
        loading={actionLoading}
      />
    </div>
  )
}

function ObrasVacia({ nombre, onNuevaObra }: { nombre: string; onNuevaObra: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-10">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-light text-[#333333] tracking-tighter mb-6">
          ¡Hola, {nombre}!
        </h1>
        <p className="font-mono text-[13px] text-[#6B7280] uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed">
          Parece que todavía no hay obras registradas
        </p>
      </div>

      <div className="w-full max-w-sm">
        <button onClick={onNuevaObra} className="w-full aspect-video border-2 border-dashed border-gray-400 p-8 flex flex-col items-center justify-center gap-6 hover:border-[#A44A3F] hover:bg-white/50 transition-all group rounded-sm shadow-sm hover:shadow-xl hover:shadow-[#A44A3F]/5">
          <div className="w-9 h-9 bg-[#A44A3F] rounded-full flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-[#8e3f35]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <line x1="7" y1="1" x2="7" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="1" y1="7" x2="13" y2="7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-center">
            <span className="block font-mono text-[12px] text-gray-500 uppercase tracking-widest font-bold group-hover:text-[#A44A3F] transition-colors">
              Comenzar nueva obra
            </span>
            <span className="block font-mono text-[10px] text-gray-400 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Definir tareas y presupuesto
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}

function ObrasLista({ obras }: { obras: { id: number; nombre: string; createdAt: string }[] }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <p className="font-mono text-[20px] tracking-[0.4em] uppercase text-[#6B7280]">
        Obras
      </p>
      <div className="overflow-y-auto h-[calc(100vh-400px)] scrollbar-hide p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
          {obras.map(obra => (
            <div
              key={obra.id}
              onClick={() => navigate(`/obras/${obra.id}`)}
              className="relative bg-white/40 backdrop-blur-sm border border-gray-200/60 p-6 hover:border-[#A44A3F]/30 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between min-h-[160px]"
            >
              <div className="absolute -top-px -left-px w-4 h-4 border-t border-l border-gray-300 group-hover:border-[#A44A3F]/40 transition-colors" />
              <p className="font-mono text-[15px] tracking-[0.3em] uppercase text-[#6B7280]">
                Obra
              </p>
              <h3 className="text-3xl font-light text-[#333333] tracking-tight">
                {obra.nombre}
              </h3>
              <p className="font-mono text-[15px] text-[#6B7280]/60">
                {new Date(obra.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
