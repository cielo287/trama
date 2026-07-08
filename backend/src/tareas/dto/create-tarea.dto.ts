import { IsString, IsOptional, IsInt, IsEnum, IsDateString } from 'class-validator';
import { EstadoTarea, PrioridadTarea } from '../enums/tareas.enums';

export class CreateTareaDto {
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsDateString()
  fechaInicio?: Date;

  @IsOptional()
  @IsDateString()
  fechaFin?: Date;

  @IsOptional()
  @IsInt()
  ordenEjecucion: number;

  @IsOptional()
  @IsEnum(PrioridadTarea)
  prioridad: PrioridadTarea;

  @IsInt()
  obraId: number;

  @IsOptional()
  @IsInt()
  tareaPadreId?: number;

  @IsOptional()
  ultimaAlertaFin?: Date;
}
