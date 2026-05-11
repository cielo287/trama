import { PartialType } from '@nestjs/mapped-types';
import { CreateDetallesMaterialDto } from './create-detalles-material.dto';

export class UpdateDetallesMaterialDto extends PartialType(CreateDetallesMaterialDto) {}
