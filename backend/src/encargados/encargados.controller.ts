import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EncargadosService } from './encargados.service';
import { CreateEncargadoDto } from './dto/create-encargado.dto';
import { UpdateEncargadoDto } from './dto/update-encargado.dto';
import { JwtAuthGuard } from '../auth/guards/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/decorators/current-user.decorator';
import type { UserPayload } from '../auth/interfaces/user-payload.interface';

@Controller('encargados')
@UseGuards(JwtAuthGuard)
export class EncargadosController {
  constructor(private readonly encargadosService: EncargadosService) {}

  @Post()
  create(
    @Body() createEncargadoDto: CreateEncargadoDto,
    @CurrentUser() user: UserPayload
  ) {
    return this.encargadosService.create(createEncargadoDto, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    return this.encargadosService.findAll(user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload
  ) {
    return this.encargadosService.findOne(+id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEncargadoDto: UpdateEncargadoDto,
    @CurrentUser() user: UserPayload
  ) {
    return this.encargadosService.update(+id, updateEncargadoDto, user.userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload
  ) {
    return this.encargadosService.remove(+id, user.userId);
  }
}