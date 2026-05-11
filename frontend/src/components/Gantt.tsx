import { useState } from 'react'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isToday, differenceInDays, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { type Tarea } from '../types'

const COL_TAREA = 220
const COL_ENCARGADO = 160
const ROW_H = 48
const MIN_COL_W = 34 // Ancho mínimo por columna de día

const ESTADO_COLOR: Record<string, string> = {
  PENDIENTE: '#67E8F9',
  EN_PROCESO: '#84CC16',
  FINALIZADA: '#F59E0B',
}

interface Props {
  tareas: Tarea[]
  onTareaClick: (tarea: Tarea) => void
  onNuevaTarea: () => void
}

export default function Gantt({ tareas, onTareaClick, onNuevaTarea }: Props) {
  const [fecha, setFecha] = useState(new Date())
  
  const start = startOfMonth(fecha)
  const end = endOfMonth(fecha)
  const dias = eachDayOfInterval({ start, end })
  const totalDays = dias.length

  const mesLabel = format(fecha, 'MMMM yyyy', { locale: es })
    .replace(/^\w/, c => c.toUpperCase())

  function prevMes() {
    setFecha(f => new Date(f.getFullYear(), f.getMonth() - 1, 1))
  }

  function nextMes() {
    setFecha(f => new Date(f.getFullYear(), f.getMonth() + 1, 1))
  }

  function getBarProps(tarea: Tarea) {
  if (!tarea.fechaInicio || !tarea.fechaFin) return null

  // Parseamos solo la parte de fecha ignorando timezone
  const [yI, mI, dI] = tarea.fechaInicio.slice(0, 10).split('-').map(Number)
  const [yF, mF, dF] = tarea.fechaFin.slice(0, 10).split('-').map(Number)

  const inicio   = new Date(yI, mI - 1, dI)
  const fin      = new Date(yF, mF - 1, dF)
  const mesStart = startOfMonth(fecha)
  const mesEnd   = endOfMonth(fecha)

  if (fin < mesStart || inicio > mesEnd) return null

  const clampedInicio = inicio < mesStart ? mesStart : inicio
  const clampedFin    = fin    > mesEnd   ? mesEnd   : fin

  const daysBefore = differenceInDays(clampedInicio, mesStart)
  const duration   = differenceInDays(clampedFin, clampedInicio) + 1

  const left  = (daysBefore / totalDays) * 100
  const width = (duration / totalDays) * 100

  return { left, width }
}

  const minTotalW = totalDays * MIN_COL_W

  return (
    <div className="bg-white border border-black/[0.08] rounded-sm overflow-hidden flex flex-col h-full">
      {/* Top Header con Controles de Navegación */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-black/[0.1] bg-white z-30">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-[#A44A3F] animate-pulse" />
          <h2 className="font-mono text-[13px] tracking-[0.2em] uppercase font-bold text-[#333]">
            Planificación: <span className="text-[#A44A3F]">{mesLabel}</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-black/[0.05]">
          <button 
            onClick={prevMes} 
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-[#6B7280] hover:text-[#A44A3F]"
            title="Mes anterior"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          
          <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#374151] font-bold px-4 min-w-[140px] text-center">
            {mesLabel}
          </div>
          
          <button 
            onClick={nextMes} 
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-[#6B7280] hover:text-[#A44A3F]"
            title="Mes siguiente"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Columnas fijas (Tareas y Encargados) */}
        <div style={{ width: COL_TAREA + COL_ENCARGADO, flexShrink: 0 }} className="border-r border-black/[0.08] flex flex-col bg-white z-10 shadow-[4px_0_10px_-5px_rgba(0,0,0,0.05)]">
          {/* Header fijo */}
          <div style={{ height: ROW_H }} className="flex border-b border-black/[0.1] bg-gray-50/50">
            <div style={{ width: COL_TAREA }} className="px-4 flex items-center font-mono text-[11px] tracking-[0.2em] uppercase text-[#6B7280] border-r border-black/[0.06]">
              Tarea
            </div>
            <div style={{ width: COL_ENCARGADO }} className="px-4 flex items-center font-mono text-[11px] tracking-[0.2em] uppercase text-[#6B7280]">
              Encargado
            </div>
          </div>
          
          {/* Filas fijas */}
          <div className="flex-1 overflow-y-auto hidden-scrollbar">
            {tareas.length === 0 ? (
              <div style={{ height: ROW_H }} className="flex items-center justify-center px-4">
                <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#8C8076]">
                  No hay tareas
                </p>
              </div>
            ) : (
              tareas.map(tarea => (
                <div 
                  key={tarea.id} 
                  onClick={() => onTareaClick(tarea)}
                  style={{ height: ROW_H }} 
                  className="flex border-b border-black/[0.04] hover:bg-[#A44A3F]/[0.02] cursor-pointer transition-colors group"
                >
                  <div style={{ width: COL_TAREA }} className="px-4 flex items-center gap-2 border-r border-black/[0.06] overflow-hidden">
                    <span className="font-mono text-[13px] text-[#333] truncate flex-1 group-hover:text-[#A44A3F] transition-colors">
                      {tarea.titulo}
                    </span>
                    {tarea.prioridad && (
                      <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-xs uppercase font-bold shrink-0 ${
                        tarea.prioridad === 'ALTA' ? 'bg-red-50 text-red-600' :
                        tarea.prioridad === 'MEDIA' ? 'bg-orange-50 text-orange-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {tarea.prioridad}
                      </span>
                    )}
                  </div>
                  <div style={{ width: COL_ENCARGADO }} className="px-4 flex items-center overflow-hidden">
                    {tarea.manoDeObra?.[0]?.encargado ? (
                      <span className="font-mono text-[13px] text-[#6B7280] truncate">
                        {tarea.manoDeObra[0].encargado.nombre} {tarea.manoDeObra[0].encargado.apellido}
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-[#ccc] uppercase tracking-wider">
                        Sin asignar
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Columna scrolleable (Calendario) */}
        <div className="flex-1 overflow-x-auto overflow-y-auto relative bg-[#F9FAFB]/20">
          <div style={{ minWidth: minTotalW, width: '100%', position: 'relative' }}>
            {/* Header calendario (Solo días) */}
            <div style={{ height: ROW_H }} className="border-b border-black/[0.1] flex flex-col sticky top-0 bg-white z-20">
              <div className="flex h-full">
                {dias.map(dia => (
                  <div 
                    key={`col-${dia.toISOString()}`} 
                    style={{ width: `${100 / totalDays}%`, flexShrink: 0 }} 
                    className={`flex flex-col items-center justify-center border-r last:border-r-0 border-black/[0.05] ${isToday(dia) ? 'bg-[#A44A3F]/[0.05]' : ''}`}
                  >
                    <span className={`font-mono text-[10px] uppercase leading-none mb-1 ${isToday(dia) ? 'text-[#A44A3F] font-bold' : 'text-[#9CA3AF]'}`}>
                      {format(dia, 'EEE', { locale: es }).slice(0, 1)}
                    </span>
                    <span className={`font-mono text-[12px] leading-none ${isToday(dia) ? 'text-[#A44A3F] font-bold' : 'text-[#4B5563]'}`}>
                      {format(dia, 'd')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filas del Gantt y Grid de fondo */}
            <div className="relative">
              {/* Grid Lines de fondo */}
              <div className="absolute inset-0 pointer-events-none flex" style={{ height: (tareas.length || 1) * ROW_H }}>
                {dias.map(dia => (
                  <div 
                    key={`grid-${dia.toISOString()}`}
                    style={{ width: `${100 / totalDays}%`, flexShrink: 0 }}
                    className={`border-r last:border-r-0 border-black/[0.03] ${isToday(dia) ? 'bg-[#A44A3F]/[0.02]' : ''}`}
                  />
                ))}
              </div>

              {/* Tareas */}
              {tareas.length === 0 ? (
                <div style={{ height: ROW_H }} />
              ) : (
                tareas.map(tarea => {
                  const bar = getBarProps(tarea)
                  return (
                    <div 
                      key={tarea.id} 
                      onClick={() => onTareaClick(tarea)}
                      style={{ height: ROW_H }} 
                      className="flex items-center border-b border-black/[0.04] hover:bg-[#A44A3F]/[0.02] cursor-pointer transition-colors relative"
                    >
                      <div className="w-full relative px-[2px] h-[14px]">
                        {bar && (
                          <div 
                            style={{ 
                              position: 'absolute', 
                              left: `${bar.left}%`, 
                              width: `${bar.width}%`, 
                              height: 14, 
                              background: ESTADO_COLOR[tarea.estado ?? 'PENDIENTE'] ?? '#67E8F9',
                              borderRadius: '4px',
                              opacity: 0.9,
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            className="group-hover:scale-y-110"
                          />
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-black/[0.05] px-4 py-4 bg-white flex items-center justify-between">
        <button onClick={onNuevaTarea} className="flex items-center gap-2 text-[#A44A3F] hover:text-[#8c3f36] transition-colors group">
          <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="5" y1="2" x2="5" y2="8" />
              <line x1="2" y1="5" x2="8" y2="5" />
            </svg>
          </div>
          <span className="font-mono text-[12px] tracking-[0.1em] uppercase font-bold">
            Nueva Tarea
          </span>
        </button>
        
        <div className="flex gap-4">
          {Object.entries(ESTADO_COLOR).map(([estado, color]) => (
            <div key={estado} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              <span className="font-mono text-[10px] uppercase text-gray-500 tracking-wider">
                {estado.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
