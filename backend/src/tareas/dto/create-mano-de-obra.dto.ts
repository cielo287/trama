import { IsNumber, IsString } from "class-validator";

export class CreateManoDeObraDto {

@IsString()
nombre: string

@IsString()
apellido: string

@IsString()
telefono: string

@IsNumber()
precio: number

}