import { useState } from 'react'
import type { DetalleMaterial, Tarea } from '@/types'
import { calcularCostoMateriales } from '@/utils/tarea'
import SectionLabel from './ui/section-label'
import MaterialForm from './MaterialForm'
import type { CreateDetalleMaterialInput } from '@/types/inputs'

interface Props {
  tarea?: Tarea | null
  isEditing: boolean
  onAgregarMaterial: (tareaId: number, data: CreateDetalleMaterialInput) => Promise<DetalleMaterial>
  onEditarMaterial: (tareaId: number, detalleMaterialId: number, data: CreateDetalleMaterialInput) => Promise<DetalleMaterial>
  onBorrarDetalleMaterial: (tareaId: number, detalleId: number) => Promise<void>
}

export default function MaterialesSection({
  tarea,
  isEditing,
  onAgregarMaterial,
  onEditarMaterial,
  onBorrarDetalleMaterial,
}: Props) {
  const materiales = tarea?.detallesMaterial ?? []
  const totalMateriales = tarea ? calcularCostoMateriales(tarea) : 0
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleCreate = async (data: CreateDetalleMaterialInput) => {
    if (!tarea) return
    try {
      await onAgregarMaterial(tarea.id, data)
      setShowForm(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleEdit = async (detalleId: number, data: CreateDetalleMaterialInput) => {
    if (!tarea) return
    try {
      await onEditarMaterial(tarea.id, detalleId, data)
      setEditingId(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleEliminar = async (detalleId: number) => {
    if (!tarea) return
    try {
      await onBorrarDetalleMaterial(tarea.id, detalleId)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="border border-black/[0.06] bg-gray-50/30 rounded-sm p-4 space-y-4">
      <SectionLabel>Materiales</SectionLabel>

      {materiales.length === 0 ? (
        <p className="text-[13px] text-[#6B7280] italic">
          Sin materiales cargados.
        </p>
      ) : (
        <div className="space-y-3">
          {materiales.map(detalle => {
            const subtotal = Number(detalle.cantidad) * Number(detalle.precioUnitario)
            const isEditingRow = editingId === detalle.id

            if (isEditingRow) {
              return (
                <div key={detalle.id} className="border border-[#A44A3F]/20 rounded-sm bg-white p-4">
                  <MaterialForm
                    initialData={{
                      nombre: detalle.material.nombre,
                      cantidad: detalle.cantidad,
                      precioUnitario: detalle.precioUnitario,
                      unidadDeMedida: detalle.unidadDeMedida,
                    }}
                    onCancel={() => setEditingId(null)}
                    onSave={(data) => handleEdit(detalle.id, data)}
                  />
                </div>
              )
            }

            return (
              <div key={detalle.id} className="flex justify-between items-start text-[13px]">
                <div>
                  <p className="text-[#333] font-medium">{detalle.material.nombre}</p>
                  <p className="text-[#6B7280] text-[12px]">
                    {detalle.cantidad} {detalle.unidadDeMedida}{' × $'}{detalle.precioUnitario}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#333] font-bold">${subtotal.toLocaleString()}</span>
                  {isEditing && (
                    <>
                      <button
                        type="button"
                        onClick={() => setEditingId(detalle.id)}
                        className="p-1 text-[#A44A3F] hover:opacity-70 transition-opacity"
                        title="Editar"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                          <path d="m15 5 4 4"/>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEliminar(detalle.id)}
                        className="p-1 text-[#6B7280] hover:text-red-400 transition-colors"
                        title="Eliminar"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}

          <div className="border-t border-black/[0.08] pt-3 flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#A44A3F]">Total</span>
            <span className="text-[#333] font-bold">${totalMateriales.toLocaleString()}</span>
          </div>
        </div>
      )}

      {showForm && (
        <div className="border border-[#A44A3F]/20 rounded-sm bg-white p-4">
          <MaterialForm
            onCancel={() => setShowForm(false)}
            onSave={handleCreate}
          />
        </div>
      )}

      {isEditing && !showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="px-2 py-1 rounded bg-[#A44A3F]/10 text-[#A44A3F] text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[#A44A3F]/15 transition-colors"
        >
          + Agregar material
        </button>
      )}
    </div>
  )
}