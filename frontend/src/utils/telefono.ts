export function telefonoAWhatsappLink(telefono: string): string | null {
  if (!telefono) return null
  const numero = telefono.replace(/\D/g, '')
  if (!numero) return null
  return `https://wa.me/${numero}`
}