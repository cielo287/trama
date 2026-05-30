import { Tarea } from "@/types"

export function calcularCostoMateriales(tarea: Tarea): number {
  return tarea.detallesMaterial.reduce(
    (acc, detalle) =>
      acc +
      Number(detalle.cantidad) *
      Number(detalle.precioUnitario),
    0
  )
}

export function calcularCostoManoDeObra(tarea: Tarea): number {
  return tarea.manoDeObra.reduce(
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