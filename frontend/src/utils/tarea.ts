import { Tarea } from "@/types"

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