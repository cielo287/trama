import type { EstadoTarea, PrioridadTarea } from './index'

export interface CreateTareaInput {
  titulo: string
  descripcion?: string
  fechaInicio?: string
  fechaFin?: string
  prioridad?: PrioridadTarea
  obraId: number
  tareaPadreId?: number
}

export interface UpdateTareaInput {
  titulo?: string
  descripcion?: string
  fechaInicio?: string
  fechaFin?: string
  ordenEjecucion?: number
  prioridad?: PrioridadTarea
  estado?: EstadoTarea
  tareaPadreId?: number
}

export interface CreateObraInput {
  nombre: string
  direccion: string
  cliente: string
}

export interface CreateManoDeObraInput {
  nombre: string
  apellido: string
  telefono: string
  precio: number
}


export interface CreateDetalleMaterialInput {
  nombre: string
  cantidad: number
  precioUnitario: number
  unidadDeMedida: string
}