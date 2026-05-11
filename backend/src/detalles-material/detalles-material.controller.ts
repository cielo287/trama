import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DetallesMaterialService } from './detalles-material.service';
import { CreateDetallesMaterialDto } from './dto/create-detalles-material.dto';
import { UpdateDetallesMaterialDto } from './dto/update-detalles-material.dto';
import { JwtAuthGuard } from '../auth/guards/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/decorators/current-user.decorator';
import type { UserPayload } from '../auth/interfaces/user-payload.interface';

@Controller('detalles-material')
@UseGuards(JwtAuthGuard)
export class DetallesMaterialController {
  constructor(private readonly detallesMaterialService: DetallesMaterialService) {}

  @Post()
  create(
    @Body() createDetallesMaterialDto: CreateDetallesMaterialDto,
    @CurrentUser() user: UserPayload
  ) {
    return this.detallesMaterialService.create(createDetallesMaterialDto, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    return this.detallesMaterialService.findAll(user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload
  ) {
    return this.detallesMaterialService.findOne(+id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDetallesMaterialDto: UpdateDetallesMaterialDto,
    @CurrentUser() user: UserPayload
  ) {
    return this.detallesMaterialService.update(+id, updateDetallesMaterialDto, user.userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload
  ) {
    return this.detallesMaterialService.remove(+id, user.userId);
  }
}
