import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { CurrentUser } from '../auth/decorators/decorators/current-user.decorator';
import type { UserPayload } from '../auth/interfaces/user-payload.interface';
import { JwtAuthGuard } from '../auth/guards/guards/jwt-auth.guard';
import { use } from 'passport';
import { EstadoTarea } from './enums/tareas.enums';
import { CambioEstadoTareaDto } from './dto/cambioEstadoTareaDto';
import { CreateDetalleMaterialDto } from './dto/create-detalle-material.dto';

@Controller('tareas')
@UseGuards(JwtAuthGuard)
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  create(@Body() createTareaDto: CreateTareaDto, @CurrentUser() user: UserPayload) {
    return this.tareasService.create(createTareaDto, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    return this.tareasService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.tareasService.findOne(+id, user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTareaDto: UpdateTareaDto, @CurrentUser() user: UserPayload) {
    return this.tareasService.update(+id, updateTareaDto, user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.tareasService.remove(+id, user.userId);
  }

  @Patch('reorder')
  async reorder(@Body() body: { orden: { id: number; orden: number }[] }, @CurrentUser() user: UserPayload) {
    try {
      await this.tareasService.reorder(body.orden, user.userId);
    } catch (error) {
      throw new Error('Error al reordenar las tareas');
    }
  }

  @Patch(':id/cambiar-estado')
  async cambiarEstado(
    @Param('id') id: string,
    @Body() cambioEstadoDto: CambioEstadoTareaDto,
    @CurrentUser() user: UserPayload
  ) {
    const { nuevoEstado, notas } = cambioEstadoDto;
    return this.tareasService.cambiarEstado(+id, nuevoEstado, user.userId, notas);
  }

  @Post(':id/detalle-material')
  async crearDetalleMaterial(
    @Param('id') id: string,
    @Body() createDetalleMaterialDto: CreateDetalleMaterialDto,
    @CurrentUser() user: UserPayload
  ) {
    return this.tareasService.crearDetalleMaterial(+id, createDetalleMaterialDto, user.userId);
  }
  
}
