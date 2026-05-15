export interface Usuario {
  id: number
  email: string
  nombre: string
  apellido: string
  createdAt: string
  updatedAt: string
}

export interface Obra {
  id: number
  nombre: string
  createdAt: string
  updatedAt: string
  usuarioId: number
  tareas: Tarea[]
}

export interface Tarea {
  id: number
  titulo: string
  descripcion?: string
  fechaInicio?: string
  fechaFin?: string
  ordenEjecucion?: number
  prioridad?: PrioridadTarea
  estado?: EstadoTarea
  obraId: number
  tareaPadreId?: number
  subtareas: Tarea[]
  detallesMaterial: DetalleMaterial[]
  manoDeObra: ManoDeObra[]
  imagenes: ImagenTarea[]
  createdAt: string
  updatedAt: string
}

export type EstadoTarea = 'PENDIENTE' | 'ATRASADA' | 'EN_PROCESO' | 'FINALIZADA'

export interface Material {
  id: number
  nombre: string
  usuarioId: number
  createdAt: string
  updatedAt: string
}

export interface DetalleMaterial {
  id: number
  precioUnitario: number
  cantidad: number
  unidadDeMedida: string
  materialId: number
  material: Material
  tareaId: number
  createdAt: string
  updatedAt: string
}

export interface Encargado {
  id: number
  nombre: string
  apellido: string
  telefono: string
  usuarioId: number
  rubros: Rubro[]
  createdAt: string
  updatedAt: string
}

export interface Rubro {
  id: number
  nombre: string
}

export interface ManoDeObra {
  id: number
  precio: number
  encargadoId?: number
  encargado?: Encargado
  tareaId: number
  createdAt: string
  updatedAt: string
}

export interface ImagenTarea {
  id: number
  url: string
  tareaId: number
}

export type PrioridadTarea = 'ALTA' | 'MEDIA' | 'BAJA'

