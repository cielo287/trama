import { IsString, IsArray, IsInt } from 'class-validator';

export class CreateEncargadoDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  telefono: string;

  @IsArray()
  @IsInt({ each: true })
  rubroIds: number[];
}