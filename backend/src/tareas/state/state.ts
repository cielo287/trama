import { EstadoTarea } from '../enums/tareas.enums';

export const TRANSICIONES_VALIDAS: Record<EstadoTarea, EstadoTarea[]> = {
    [EstadoTarea.PENDIENTE]: [
        EstadoTarea.EN_CURSO,
        EstadoTarea.FINALIZADA,
    ],
    [EstadoTarea.EN_CURSO]: [
        EstadoTarea.FINALIZADA,
        EstadoTarea.PENDIENTE // Por si se decide posponerla
    ],

    [EstadoTarea.FINALIZADA]: [
        EstadoTarea.EN_CURSO // Por si hay que reabrirla por un arreglo de último momento
    ],
};