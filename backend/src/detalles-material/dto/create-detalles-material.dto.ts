import { IsInt, IsString, IsNumber } from 'class-validator';

export class CreateDetallesMaterialDto {
  @IsNumber()
  precioUnitario: number;  

  @IsNumber()
  cantidad: number;

  @IsString()
  unidadDeMedida: string; 

  @IsInt()
  materialId: number;

  @IsInt()
  tareaId: number;
}