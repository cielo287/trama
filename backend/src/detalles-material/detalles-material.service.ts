import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateDetallesMaterialDto } from './dto/create-detalles-material.dto';
import { UpdateDetallesMaterialDto } from './dto/update-detalles-material.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DetallesMaterialService {
  constructor(private prisma: PrismaService) {}

  async create(createDetallesMaterialDto: CreateDetallesMaterialDto, usuarioId: number) {
    
    const tarea = await this.prisma.tarea.findFirst({
      where: {
        id: createDetallesMaterialDto.tareaId,
        obra: { usuarioId }
      }
    });

    if (!tarea) {
      throw new NotFoundException('Tarea no encontrada o no tenés acceso');
    }

    
    const material = await this.prisma.material.findFirst({
      where: {
        id: createDetallesMaterialDto.materialId,
        usuarioId
      }
    });

    if (!material) {
      throw new NotFoundException('Material no encontrado o no tenés acceso');
    }

    return this.prisma.detalleMaterial.create({
      data: createDetallesMaterialDto,
      include: {
        material: true,
        tarea: true
      }
    });
  }

  async findAll(usuarioId: number) {
    return this.prisma.detalleMaterial.findMany({
      where: {
        tarea: {
          obra: { usuarioId }
        }
      },
      include: {
        material: true,
        tarea: true
      }
    });
  }

  async findOne(id: number, usuarioId: number) {
    const detalle = await this.prisma.detalleMaterial.findFirst({
      where: {
        id,
        tarea: {
          obra: { usuarioId }
        }
      },
      include: {
        material: true,
        tarea: true
      }
    });

    if (!detalle) {
      throw new NotFoundException('Detalle de material no encontrado o no tenés acceso');
    }

    return detalle;
  }

  async update(id: number, updateDetallesMaterialDto: UpdateDetallesMaterialDto, usuarioId: number) {
    await this.findOne(id, usuarioId);

    return this.prisma.detalleMaterial.update({
      where: { id },
      data: updateDetallesMaterialDto,
      include: {
        material: true,
        tarea: true
      }
    });
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id, usuarioId);

    return this.prisma.detalleMaterial.delete({
      where: { id }
    });
  }
}