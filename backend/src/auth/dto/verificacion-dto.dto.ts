import { IsEmail, IsString, Length } from 'class-validator';

export class VerificarCodigoDto {
  @IsEmail()
  email: string 

  @IsString()
  @Length(6, 6)
  codigo: string 
}