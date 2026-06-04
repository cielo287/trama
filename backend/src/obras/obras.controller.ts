import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ObrasService } from './obras.service';
import { CreateObraDto } from './dto/create-obra.dto';
import { UpdateObraDto } from './dto/update-obra.dto';
import { JwtAuthGuard } from '../auth/guards/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/decorators/current-user.decorator';
import type { UserPayload } from '../auth/interfaces/user-payload.interface';


@Controller('obras')
@UseGuards(JwtAuthGuard)
export class ObrasController {
  constructor(private readonly obrasService: ObrasService) {}

  @Post()
  create(@Body() createObraDto: CreateObraDto, @CurrentUser() user: UserPayload) {
    return this.obrasService.create(createObraDto, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    return this.obrasService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.obrasService.findOne(+id, user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, 
  @Body() updateObraDto: UpdateObraDto, 
  @CurrentUser() user: UserPayload) {
    return this.obrasService.update(+id, updateObraDto, user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.obrasService.remove(+id, user.userId);
  }

  @Get(':id/tareas')
    findTareas(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload
    ) {
    return this.obrasService.findTareas(+id, user.userId);
  }
}
