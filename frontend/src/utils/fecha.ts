// src/utils/fecha.ts

export function parseFechaCalendario(fecha: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    const [y, m, d] = fecha.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  const d = new Date(fecha)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}


export function formatFechaCalendario(fecha: string) {
  return parseFechaCalendario(fecha).toLocaleDateString(
    'es-AR',
    {
      day: '2-digit',
      month: 'short',
      //year: 'numeric',
    }
  )
}

function formatFechaRango(
  fechaInicio: string | null | undefined,
  fechaFin: string | null | undefined
): string {
  const fmt = (f: string) =>
    parseFechaCalendario(f).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
    })

  if (fechaInicio && fechaFin) return `${fmt(fechaInicio)} → ${fmt(fechaFin)}`
  if (fechaInicio) return `Desde ${fmt(fechaInicio)}`
  if (fechaFin) return `Hasta ${fmt(fechaFin)}`
  return ''
}