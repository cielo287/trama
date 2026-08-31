import { EstadoTarea } from '../enums/tareas.enums';

export const TRANSICIONES_VALIDAS: Record<EstadoTarea, EstadoTarea[]> = {
    [EstadoTarea.PENDIENTE]: [
        EstadoTarea.EN_CURSO,
        EstadoTarea.FINALIZADA,
    ],
    [EstadoTarea.EN_CURSO]: [
        EstadoTarea.FINALIZADA,
        
    ],

    [EstadoTarea.FINALIZADA]: [],
};