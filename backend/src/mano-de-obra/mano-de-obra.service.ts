import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateManoDeObraDto } from './dto/create-mano-de-obra.dto';
import { UpdateManoDeObraDto } from './dto/update-mano-de-obra.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ManoDeObraService {
  constructor(private prisma: PrismaService) {}

  async create(createManoDeObraDto: CreateManoDeObraDto, usuarioId: number) {
    
    const tarea = await this.prisma.tarea.findFirst({
      where: {
        id: createManoDeObraDto.tareaId,
        obra: { usuarioId }
      }
    });

    if (!tarea) {
      throw new NotFoundException('Tarea no encontrada o no tenés acceso');
    }

    
    if (createManoDeObraDto.encargadoId) {
      const encargado = await this.prisma.encargado.findFirst({
        where: {
          id: createManoDeObraDto.encargadoId,
          usuarioId
        }
      });

      if (!encargado) {
        throw new NotFoundException('Encargado no encontrado o no tenés acceso');
      }
    }

    return this.prisma.manoDeObra.create({
      data: createManoDeObraDto,
      include: {
        encargado: true,
        tarea: true
      }
    });
  }

  async findAll(usuarioId: number) {
    return this.prisma.manoDeObra.findMany({
      where: {
        tarea: {
          obra: { usuarioId }
        }
      },
      include: {
        encargado: true,
        tarea: true
      }
    });
  }

  async findOne(id: number, usuarioId: number) {
    const manoDeObra = await this.prisma.manoDeObra.findFirst({
      where: {
        id,
        tarea: {
          obra: { usuarioId }
        }
      },
      include: {
        encargado: true,
        tarea: true
      }
    });

    if (!manoDeObra) {
      throw new NotFoundException('Mano de obra no encontrada o no tenés acceso');
    }

    return manoDeObra;
  }

  async update(id: number, updateManoDeObraDto: UpdateManoDeObraDto, usuarioId: number) {
    await this.findOne(id, usuarioId);

    return this.prisma.manoDeObra.update({
      where: { id },
      data: updateManoDeObraDto,
      include: {
        encargado: true,
        tarea: true
      }
    });
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id, usuarioId);

    return this.prisma.manoDeObra.delete({
      where: { id }
    });
  }
}
