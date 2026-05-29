import { IsNumber, IsOptional, IsString } from "class-validator"

export class CreateDetalleMaterialDto {

@IsString()
nombre: string

@IsOptional()
@IsNumber()
cantidad: number

@IsOptional()
@IsNumber()
precioUnitario: number

@IsOptional()
unidadDeMedida: string
}