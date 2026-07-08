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
  direccion?: string
  cliente?: string
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
  estado: EstadoTarea
  obraId: number
  tareaPadreId?: number
  subtareas: Tarea[]
  bloqueadaPor?: TareaDependencia[]
  bloquea?: TareaDependencia[]
  detallesMaterial: DetalleMaterial[]
  manoDeObra: ManoDeObra[]
  imagenes: ImagenTarea[]
  createdAt: string
  updatedAt: string
}

export interface TareaDependencia {
  id: number

  bloqueadoraId: number
  dependienteId: number

  bloqueadora?: Tarea
  dependiente?: Tarea
}

export type EstadoTarea = 'PENDIENTE' |'EN_CURSO' | 'FINALIZADA'

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
  createdAt: string
  updatedAt: string
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

