import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateManoDeObraDto {
  @IsNumber()
  precio: number;

  @IsInt()
  tareaId: number;

  @IsOptional()
  @IsInt()
  encargadoId?: number;  // Opcional, puede no tener encargado asignado
}