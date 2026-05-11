import { Module } from '@nestjs/common';
import { DetallesMaterialService } from './detalles-material.service';
import { DetallesMaterialController } from './detalles-material.controller';

@Module({
  controllers: [DetallesMaterialController],
  providers: [DetallesMaterialService],
})
export class DetallesMaterialModule {}
