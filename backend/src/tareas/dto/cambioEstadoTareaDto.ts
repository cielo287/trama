
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoTarea } from '../enums/tareas.enums';

export class CambioEstadoTareaDto {
  @IsEnum(EstadoTarea, {
        message: 'El estado debe ser: PENDIENTE, EN_PROCESO, ATRASADA o FINALIZADA',
    })
    
    nuevoEstado!: EstadoTarea;

  @IsOptional()
  @IsString()
  notas?: string;
}