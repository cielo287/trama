import { IsString } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  nombre: string;
}