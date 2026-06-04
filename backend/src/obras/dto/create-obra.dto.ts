import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateObraDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  cliente?: string;

}