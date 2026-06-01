// src/utils/fecha.ts

export function parseFechaCalendario(fecha: string) {
  const [year, month, day] = fecha.slice(0, 10).split('-')

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  )
}

export function formatFechaCalendario(fecha: string) {
  return parseFechaCalendario(fecha).toLocaleDateString(
    'es-AR',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }
  )
}