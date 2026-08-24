import { apiFetch } from './client'

export interface Material {
  id: number
  nombre: string
}

export function getMateriales(): Promise<Material[]> {
  return apiFetch('/api/materiales')
}