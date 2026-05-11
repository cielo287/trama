import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { CurrentUser } from '../auth/decorators/decorators/current-user.decorator';
import type { UserPayload } from '../auth/interfaces/user-payload.interface';
import { JwtAuthGuard } from '../auth/guards/guards/jwt-auth.guard';
import { use } from 'passport';

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
}
