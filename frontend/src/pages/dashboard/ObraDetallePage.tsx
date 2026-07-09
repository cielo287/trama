import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getObras } from '@/api/obras'
import type { Obra, Tarea, } from '@/types'
import Header from '@/components/Header'
import { useTareas } from '@/hooks/useTareas'
import Gantt from '@/components/Gantt'
import TareaPanel from '@/components/TareaPanel'
import Kanban from '@/components/Kanban'
import SelectorMes from '@/components/SelectorMes'
import AlertDialog from '@/components/AlertDialog'
import AlertaFinDialog from '@/components/AlertaFinDialog'

type Seccion = 'tareas' | 'cronograma' | 'presupuesto' | 'metricas' | 'archivos'

export default function ObraPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [obra, setObra] = useState<Obra | null>(null)
  const [loading, setLoading] = useState(true)
  const [seccion, setSeccion] = useState<Seccion>('tareas')
  const { tareas,
     loading: loadingTareas, 
     crear, 
     editar, 
     eliminar, 
     reordenar, 
     cambiarEstado,
     creating, 
     updating,
    agregarMaterial, 
    agregarManoDeObra,
    editarMaterial,
    editarMdo,
    borrarDetalleMaterial,
    eliminarMdo,
    crearDependencia,
    error,
    limpiarError,
    obtenerAlertasFin,
    responderAlertaFin,
    actionLoading
  } = useTareas(Number(id))

  const [panelAbierto, setPanelAbierto] = useState(false)
  const [tareaSeleccionadaId, setTareaSeleccionadaId] =
  useState<number | null>(null)
  const [tareaIndex, setTareaIndex] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'gantt' | 'kanban'>('gantt')
  const [fechaSeleccionada, setFechaSeleccionada] =
  useState(new Date())
  const [abrirEnEdicion, setAbrirEnEdicion] = useState(false)
  const [alertasFin, setAlertasFin] = useState<Tarea[]>([])

useEffect(() => {
  obtenerAlertasFin().then(setAlertasFin).catch(console.error)
}, [id])

async function handleAlertaFin(termino: boolean) {
  const tarea = alertasFin[0]
  if (!tarea) return
  await responderAlertaFin(tarea.id, termino)
  setAlertasFin(prev => prev.slice(1))
}
  
  const tareaSeleccionada =
  tareas.find(t => t.id === tareaSeleccionadaId) ?? null
  
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
  setAbrirEnEdicion(true)
  setTareaSeleccionadaId(null)
  setPanelAbierto(true)
}

function abrirEditarTarea(tarea: Tarea) {

  const index = tareas.findIndex(t => t.id === tarea.id)
  setAbrirEnEdicion(false)
  setTareaIndex(index)
  setTareaSeleccionadaId(tarea.id)
  setPanelAbierto(true)
}

function irSiguiente() {
  if (tareaIndex === null || tareas.length === 0) return
  
  const siguiente = tareaIndex + 1
  
  // 🔄 Si el siguiente índice supera el límite, volvemos a la primera (0)
  if (siguiente >= tareas.length) {
    setTareaIndex(0)
    setTareaSeleccionadaId(tareas[0].id)
  } else {
    setTareaIndex(siguiente)
    setTareaSeleccionadaId(tareas[siguiente].id)
  }
}

function irAnterior() {
  if (tareaIndex === null || tareas.length === 0) return
  
  const anterior = tareaIndex - 1
  
  // 🔄 Si el anterior es menor a 0, saltamos a la última tarea (tareas.length - 1)
  if (anterior < 0) {
    const ultimoIndex = tareas.length - 1
    setTareaIndex(ultimoIndex)
    setTareaSeleccionadaId(tareas[ultimoIndex].id)
  } else {
    setTareaIndex(anterior)
    setTareaSeleccionadaId(tareas[anterior].id)
  }
}

  function cerrarPanel() {
    setPanelAbierto(false)
    setTareaSeleccionadaId(null)
  }

function handleTareaCreada(tarea: Tarea) {
  setAbrirEnEdicion(true)
  setTareaSeleccionadaId(tarea.id)

  const index = tareas.findIndex(t => t.id === tarea.id)

  setTareaIndex(index >= 0 ? index : tareas.length)
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
        <main className="flex-1 overflow-auto p-7 bg-[#F8F6F1]">

{seccion === 'tareas' && (
  loadingTareas
    ? <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-[#6B7280]">Cargando...</p>
    : <div className="flex flex-col gap-4 h-full">
        {/* Selector de vista */}
        <div className="flex items-center justify-between">
<div className="space-y-4 mb-5 flex-1 flex flex-col justify-center">
  <div className="flex items-center gap-3 text-2xl font-light tracking-tight">
    <button
      onClick={() => navigate('/')}
      className="
        text-[#333333]
        hover:text-[#A44A3F]
        transition-colors
        cursor-pointer
      "
    >
      OBRAS
    </button>

    <span className="text-[#A44A3F]/40">/</span>

    <span className="text-[#333333] uppercase">
      {obra.nombre}
    </span>
  </div>
</div>
  <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md border border-black/[0.05]">
      <button
        onClick={() => setViewMode('kanban')}
        className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-sm transition-all ${
          viewMode === 'kanban'
            ? 'bg-white shadow-sm text-[#A44A3F]'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        Tablero
      </button>

      <button
        onClick={() => setViewMode('gantt')}
        className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-sm transition-all ${
          viewMode === 'gantt'
            ? 'bg-white shadow-sm text-[#A44A3F]'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        Cronograma
      </button>
    </div>
    
    <SelectorMes
      fecha={fechaSeleccionada}
      onChange={setFechaSeleccionada}
    />


  </div>
</div>
         

        {/* Vista */}
        {viewMode === 'gantt' && (
          <Gantt
            tareas={tareas ?? []}
            fecha={fechaSeleccionada}
            onFechaChange={setFechaSeleccionada}
            onTareaClick={abrirEditarTarea}
            onNuevaTarea={abrirNuevaTarea}
            onUpdateTareas={handleUpdateTareas}
            onCrearDependencia={crearDependencia}
          />
        )}
        {viewMode === 'kanban' && (
          <Kanban
            tareas={tareas ?? []}
            fecha={fechaSeleccionada}
            onUpdateTareas={reordenar}
            onCambiarEstado={cambiarEstado}
            onTareaClick={abrirEditarTarea}
            onNuevaTarea={abrirNuevaTarea}
          />
        )}
      </div>
)}
          {seccion === 'cronograma' && <Proximamente />}
          {seccion === 'presupuesto' && <Proximamente />}
          {seccion === 'metricas' && <Proximamente />}
          {seccion === 'archivos' && <Proximamente />}
        </main>
      </div>

      <TareaPanel
        open={panelAbierto}
        tarea={
          tareaSeleccionada}
        obraId={Number(id)}
        totalTareas={tareas?.length ?? 0}
        onClose={cerrarPanel}
        onCreate={crear}
        onCreated={handleTareaCreada}
        onUpdate={editar}
        onDelete={eliminar}
        onCambiarEstado={cambiarEstado}
        loading={tareaSeleccionada ? updating : creating}
        onNext={irSiguiente}
        onPrevious={irAnterior}
        onAgregarMaterial={agregarMaterial}
        onAgregarManoDeObra={agregarManoDeObra}
        abrirEnEdicion={abrirEnEdicion}
        onEditarMaterial={editarMaterial}
        onEditarManoDeObra={editarMdo}
        onBorrarDetalleMaterial={borrarDetalleMaterial}
        onEliminarManoDeObra={eliminarMdo}
        
      />
      <AlertDialog
        open={!!error}
        title="No se pudo completar la acción"
        message={error ?? ''}
        onClose={limpiarError}
      />
      <AlertaFinDialog
        open={alertasFin.length > 0}
        tarea={alertasFin[0] ?? null}
        restantes={alertasFin.length}
        loading={actionLoading}
        onSi={() => handleAlertaFin(true)}
        onNo={() => handleAlertaFin(false)}
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