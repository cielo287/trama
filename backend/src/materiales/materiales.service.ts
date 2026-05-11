import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-materiale.dto';
import { UpdateMaterialDto } from './dto/update-materiale.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MaterialesService {
  constructor(private prisma: PrismaService) {}

  async create(createMaterialDto: CreateMaterialDto, usuarioId: number) {
    const existingMaterial = await this.prisma.material.findFirst({
      where: {
        nombre: createMaterialDto.nombre,
        usuarioId
      }
    });

    if (existingMaterial) {
      throw new ConflictException(`Ya existe un material llamado "${createMaterialDto.nombre}" en tu catálogo`);
    }

    return this.prisma.material.create({
      data: {
        ...createMaterialDto,
        usuarioId,
      },
    });
  }

  async findAll(usuarioId: number) {
    return this.prisma.material.findMany({
      where: { usuarioId },
    });
  }

  async findOne(id: number, usuarioId: number) {
    const material = await this.prisma.material.findFirst({
      where: { 
        id,
        usuarioId 
      },
    });

    if (!material) {
      throw new NotFoundException(`Material con id ${id} no encontrado o no tenés acceso`);
    }

    return material;
  }

  async update(id: number, updateMaterialDto: UpdateMaterialDto, usuarioId: number) {
    await this.findOne(id, usuarioId);

    return this.prisma.material.update({
      where: { id },
      data: updateMaterialDto,
    });
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id, usuarioId);

    return this.prisma.material.delete({
      where: { id },
    });
  }
}