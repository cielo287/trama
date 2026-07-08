import { EstadoTarea, Tarea } from "@/types"
import { parseFechaCalendario } from "./fecha"

export function calcularCostoMateriales(tarea: Tarea) {
  const materiales = tarea.detallesMaterial ?? []

  return materiales.reduce((acc, m) => {
    return acc + Number(m.cantidad) * Number(m.precioUnitario)
  }, 0)
}

export function calcularCostoManoDeObra(tarea: Tarea): number {
  const manoDeObra = tarea.manoDeObra ?? []
  return manoDeObra.reduce(
    (acc, mano) =>
      acc + Number(mano.precio),
    0
  )
}

export function calcularCostoTotal(tarea: Tarea): number {
  return (
    calcularCostoMateriales(tarea) +
    calcularCostoManoDeObra(tarea)
  )
}

export function esAtrasada(tarea: { estado: EstadoTarea; fechaInicio?: string | null; fechaFin?: string | null }): boolean {
  if (tarea.estado === 'FINALIZADA') return false

  // Venció el plazo de fin
  if (tarea.fechaFin && new Date(tarea.fechaFin) < new Date()) return true

  // Debería haber arrancado y no arrancó
  if (tarea.estado !== 'EN_CURSO' && tarea.fechaInicio && new Date(tarea.fechaInicio) < new Date()) return true

  return false
}

export interface InfoAtraso {
  atrasada: boolean
  dias: number
}

export function calcularAtraso(tarea: {
  estado: EstadoTarea
  fechaInicio?: string | null
  fechaFin?: string | null
}): InfoAtraso {
  if (tarea.estado === 'FINALIZADA') {
    return { atrasada: false, dias: 0 }
  }

  const hoy = parseFechaCalendario(new Date().toISOString())
  const MS_DIA = 1000 * 60 * 60 * 24

  let limite: Date | null = null

  if (tarea.fechaFin) {
    limite = parseFechaCalendario(tarea.fechaFin)
  } else if (tarea.estado !== 'EN_CURSO' && tarea.fechaInicio) {
    limite = parseFechaCalendario(tarea.fechaInicio)
  }

  if (!limite) {
    return { atrasada: false, dias: 0 }
  }

  const dias = Math.floor((hoy.getTime() - limite.getTime()) / MS_DIA)

  return dias >= 0
    ? { atrasada: true, dias }
    : { atrasada: false, dias: 0 }
}