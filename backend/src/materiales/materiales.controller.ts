import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MaterialesService } from './materiales.service';
import { CreateMaterialDto } from './dto/create-materiale.dto';
import { UpdateMaterialDto } from './dto/update-materiale.dto';
import { JwtAuthGuard } from '../auth/guards/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/decorators/current-user.decorator';
import type { UserPayload } from '../auth/interfaces/user-payload.interface';

@Controller('materiales')
@UseGuards(JwtAuthGuard)
export class MaterialesController {
  constructor(private readonly materialesService: MaterialesService) {}

  @Post()
  create(
    @Body() createMaterialDto: CreateMaterialDto,
    @CurrentUser() user: UserPayload
  ) {
    return this.materialesService.create(createMaterialDto, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    return this.materialesService.findAll(user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload
  ) {
    return this.materialesService.findOne(+id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
    @CurrentUser() user: UserPayload
  ) {
    return this.materialesService.update(+id, updateMaterialDto, user.userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload
  ) {
    return this.materialesService.remove(+id, user.userId);
  }
}
