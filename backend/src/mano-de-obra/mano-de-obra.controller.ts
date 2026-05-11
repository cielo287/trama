import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ManoDeObraService } from './mano-de-obra.service';
import { CreateManoDeObraDto } from './dto/create-mano-de-obra.dto';
import { UpdateManoDeObraDto } from './dto/update-mano-de-obra.dto';
import { JwtAuthGuard } from '../auth/guards/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/decorators/current-user.decorator';
import type { UserPayload } from '../auth/interfaces/user-payload.interface';

@Controller('mano-de-obra')
@UseGuards(JwtAuthGuard)
export class ManoDeObraController {
  constructor(private readonly manoDeObraService: ManoDeObraService) {}

  @Post()
  create(
    @Body() createManoDeObraDto: CreateManoDeObraDto,
    @CurrentUser() user: UserPayload
  ) {
    return this.manoDeObraService.create(createManoDeObraDto, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    return this.manoDeObraService.findAll(user.userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload
  ) {
    return this.manoDeObraService.findOne(+id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateManoDeObraDto: UpdateManoDeObraDto,
    @CurrentUser() user: UserPayload
  ) {
    return this.manoDeObraService.update(+id, updateManoDeObraDto, user.userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload
  ) {
    return this.manoDeObraService.remove(+id, user.userId);
  }
}
