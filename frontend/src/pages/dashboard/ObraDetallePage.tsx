import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getObras } from '@/api/obras'
import type { Obra, Tarea } from '@/types'
import Header from '@/components/Header'
import { useTareas } from '@/hooks/useTareas'
import Gantt from '@/components/Gantt'
import TareaPanel from '@/components/TareaPanel'

type Seccion = 'tareas' | 'cronograma' | 'presupuesto' | 'metricas' | 'archivos'

export default function ObraPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [obra, setObra] = useState<Obra | null>(null)
  const [loading, setLoading] = useState(true)
  const [seccion, setSeccion] = useState<Seccion>('tareas')
  const { tareas, loading: loadingTareas, actionLoading, crear, editar, eliminar, reordenar } = useTareas(Number(id))

  const [panelAbierto, setPanelAbierto] = useState(false)
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null)

  useEffect(() => {
    getObras()
      .then(obras => {
        const found = obras.find(o => o.id === Number(id))
        if (!found) navigate('/')
        else setObra(found)
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  function abrirNuevaTarea() {
    setTareaSeleccionada(null)
    setPanelAbierto(true)
  }

  function abrirEditarTarea(tarea: Tarea) {
    setTareaSeleccionada(tarea)
    setPanelAbierto(true)
  }

  function cerrarPanel() {
    setPanelAbierto(false)
    setTareaSeleccionada(null)
  }

function handleUpdateTareas(nuevasTareas: Tarea[]) {
  // Actualizamos estado local primero
  reordenar(nuevasTareas)

  // Sincronizamos con backend solo lo que cambió
  nuevasTareas.forEach(async (nueva, index) => {
    const original = tareas.find(t => t.id === nueva.id)
    if (!original) return
    if (
      original.fechaInicio !== nueva.fechaInicio ||
      original.fechaFin !== nueva.fechaFin ||
      original.ordenEjecucion !== index + 1
    ) {
      await editar(nueva.id, {
        fechaInicio: nueva.fechaInicio ?? undefined,
        fechaFin: nueva.fechaFin ?? undefined,
        ordenEjecucion: index + 1,
      })
    }
  })
}

  if (loading) {
    return (
      <div className="h-screen bg-[#F8F6F1] flex items-center justify-center">
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#6B7280]">Cargando...</p>
      </div>
    )
  }

  if (!obra) return null

  return (
    <div className="h-screen flex flex-col bg-[#F8F6F1] overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-[220px] shrink-0 border-r border-black/[0.08] bg-white/20 flex flex-col overflow-y-auto pt-5">
          {([
            { key: 'tareas',      label: 'Tareas' },
            { key: 'cronograma',  label: 'Cronograma' },
            { key: 'presupuesto', label: 'Presupuesto' },
            { key: 'metricas',    label: 'Métricas' },
            { key: 'archivos',    label: 'Archivos' },
          ] as { key: Seccion; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSeccion(key)}
              className={`flex items-center gap-2 w-full px-4 py-2 text-left rounded-sm mb-0.5 transition-colors font-mono text-[12px] tracking-[0.18em] uppercase font-bold ${
                seccion === key
                  ? 'bg-[#A44A3F]/8 text-[#A44A3F] border-l-2 border-[#A44A3F]'
                  : 'text-[#6B7280] hover:bg-black/[0.04]'
              }`}
            >
              {label}
            </button>
          ))}
        </aside>

        {/* Área principal */}
        <main className="flex-1 overflow-auto p-7">
          <h3 className="text-xl font-light text-[#333] tracking-tight mb-6">
            {obra.nombre}
          </h3>

          {seccion === 'tareas' && (
            loadingTareas
              ? <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#6B7280]">Cargando...</p>
              : <Gantt
                  tareas={tareas ?? []}
                  onTareaClick={abrirEditarTarea}
                  onNuevaTarea={abrirNuevaTarea}
                  onUpdateTareas={handleUpdateTareas}
                />
          )}
          {seccion === 'cronograma' && <Proximamente />}
          {seccion === 'presupuesto' && <Proximamente />}
          {seccion === 'metricas' && <Proximamente />}
          {seccion === 'archivos' && <Proximamente />}
        </main>
      </div>

      <TareaPanel
        open={panelAbierto}
        tarea={tareaSeleccionada}
        obraId={Number(id)}
        totalTareas={tareas?.length ?? 0}
        onClose={cerrarPanel}
        onCreate={crear}
        onUpdate={editar}
        onDelete={eliminar}
        loading={actionLoading}
      />
    </div>
  )
}

function Proximamente() {
  return (
    <div className="bg-white border border-black/[0.08] rounded-sm p-10 flex items-center justify-center min-h-[180px]">
      <p className="font-mono text-[13px] tracking-[0.25em] uppercase text-[#8C8076]">Próximamente</p>
    </div>
  )
}