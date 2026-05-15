import { EstadoTarea } from '../enums/tareas.enums';

export const TRANSICIONES_VALIDAS: Record<EstadoTarea, EstadoTarea[]> = {
    [EstadoTarea.PENDIENTE]: [
        EstadoTarea.EN_PROCESO,
        EstadoTarea.FINALIZADA,
        EstadoTarea.ATRASADA // <-- Habilitado: se atrasó antes de empezar (ej: llovió)
    ],
    [EstadoTarea.EN_PROCESO]: [
        EstadoTarea.ATRASADA, // Se venció el plazo mientras se ejecutaba
        EstadoTarea.FINALIZADA,
        EstadoTarea.PENDIENTE // Por si se decide posponerla
    ],
    [EstadoTarea.ATRASADA]: [
        EstadoTarea.EN_PROCESO, // Se reactiva la tarea rezagada
        EstadoTarea.FINALIZADA
    ],
    [EstadoTarea.FINALIZADA]: [
        EstadoTarea.EN_PROCESO // Por si hay que reabrirla por un arreglo de último momento
    ],
};