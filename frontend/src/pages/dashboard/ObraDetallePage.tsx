import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getObras, getObra } from '@/api/obras'
import type { Obra, Tarea, TareaConAlerta } from '@/types'
import Header from '@/components/Header'
import { useTareas } from '@/hooks/useTareas'
import Gantt from '@/components/Gantt'
import TareaPanel from '@/components/TareaPanel'
import Kanban from '@/components/Kanban'
import SelectorMes from '@/components/SelectorMes'
import AlertDialog from '@/components/AlertDialog'
import AlertasFinPanel from '@/components/AlertasFinPanel'
import { Bell } from 'lucide-react'
import { useRef } from 'react'
import ConfirmDialog from '@/components/ConfirmDialog'

type Seccion = 'tareas' | 'presupuesto' | 'proveedores'| 'metricas' | 'archivos'

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
  const [tareaAEliminar, setTareaAEliminar] = useState<Tarea | null>(null)
  const [alertasFin, setAlertasFin] = useState<TareaConAlerta[]>([])
  const [alertaFinAbierta, setAlertaFinAbierta] = useState(false)
      useEffect(() => {
        obtenerAlertasFin().then(setAlertasFin).catch(console.error)
  }, [id])

async function handleAlertaFin(tareaId: number, termino: boolean) {
  await responderAlertaFin(tareaId, termino)
  setAlertasFin(prev => prev.filter(t => t.id !== tareaId))
}
  
  const tareaSeleccionada =
  tareas.find(t => t.id === tareaSeleccionadaId) ?? null
  
useEffect(() => {
  getObra(Number(id))
    .then(setObra)
    .catch(() => navigate('/'))
    .finally(() => setLoading(false))
}, [id])

  const notifRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  function handleClick(e: MouseEvent) {
    if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
      setAlertaFinAbierta(false)
    }
  }
  document.addEventListener('mousedown', handleClick)
  return () => document.removeEventListener('mousedown', handleClick)
}, [])

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
  reordenar(nuevasTareas)

  nuevasTareas.forEach(async (nueva, index) => {
    const original = tareas.find(t => t.id === nueva.id)
    if (!original) return

    const cambioFecha = original.fechaInicio !== nueva.fechaInicio || original.fechaFin !== nueva.fechaFin
    const cambioOrden = original.ordenEjecucion !== index + 1

    if (!cambioFecha && !cambioOrden) return

    const payload: any = { ordenEjecucion: index + 1 }
    if (cambioFecha) {
      payload.fechaInicio = nueva.fechaInicio ?? undefined
      payload.fechaFin = nueva.fechaFin ?? undefined
    }

    await editar(nueva.id, payload)
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
            {key: 'proveedores', label: 'Proveedores'},
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
    <div className="relative" ref={notifRef}>
  <button
    onClick={() => setAlertaFinAbierta(prev => !prev)}
    className="relative flex items-center justify-center w-9 h-9 rounded-sm border border-black/[0.08] bg-white hover:bg-black/[0.03] transition-colors"
    aria-label="Tareas pendientes de confirmar"
  >
    <Bell className="w-4 h-4 text-[#6B7280]" />
    {alertasFin.length > 0 && (
      <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#A44A3F] text-white text-[10px] font-bold font-mono leading-none">
        {alertasFin.length}
      </span>
    )}
  </button>

  {alertaFinAbierta && (
    <AlertasFinPanel
      alertas={alertasFin}
      loading={actionLoading}
      onResponder={handleAlertaFin}
    />
  )}
</div>


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
            onCrearRapida={(titulo) => crear({ titulo, obraId: Number(id), prioridad: 'MEDIA' })}

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
          {seccion === 'proveedores' && <Proximamente/>}
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
        onCreated={handleTareaCreada}
        onUpdate={editar}
        onDelete={eliminar}
        onRequestDelete={setTareaAEliminar}
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
      <ConfirmDialog
  open={!!tareaAEliminar}
  title="Eliminar tarea"
  message={`¿Seguro que querés eliminar la tarea "${tareaAEliminar?.titulo}"? Esta acción no se puede deshacer y borrará los registros asociados.`}
  confirmText="Eliminar permanentemente"
  cancelText="Conservar"
  onCancel={() => setTareaAEliminar(null)}
  onConfirm={async () => {
    if (!tareaAEliminar) return

    await eliminar(tareaAEliminar.id)
    setTareaAEliminar(null)
  }}
/>

<AlertDialog
  open={!!error}
  title="No se pudo completar la acción"
  message={error ?? ''}
  onClose={limpiarError}
/>
      <AlertDialog
        open={!!error}
        title="No se pudo completar la acción"
        message={error ?? ''}
        onClose={limpiarError}
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