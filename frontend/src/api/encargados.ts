import { apiFetch } from './client'

export interface Encargado {
  id: number
  nombre: string
  apellido: string
  telefono: string
}

export function getEncargados(): Promise<Encargado[]> {
  return apiFetch('/api/encargados')
}