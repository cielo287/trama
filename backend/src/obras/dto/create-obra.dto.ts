import { IsString, IsInt } from 'class-validator';

export class CreateObraDto {
  @IsString()
  nombre: string;

}