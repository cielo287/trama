import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateEncargadoDto } from './dto/create-encargado.dto';
import { UpdateEncargadoDto } from './dto/update-encargado.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EncargadosService {
  constructor(private prisma: PrismaService) {}

  async create(createEncargadoDto: CreateEncargadoDto, usuarioId: number) {
    
    const { rubroIds, ...encargadoData } = createEncargadoDto;  
    const existingEncargado = await this.prisma.encargado.findFirst({
      where: {
        nombre: encargadoData.nombre,
        apellido: encargadoData.apellido,
        telefono: encargadoData.telefono,
        usuarioId
      }
    });

    if (existingEncargado) {
      throw new ConflictException('Este encargado ya está en tu catálogo');
    }

    return this.prisma.encargado.create({
      data: {
        ...encargadoData,
        usuarioId,
        rubros: {
          connect: rubroIds.map(id => ({id}))
        }
      },
      include: {
        rubros: true
      }
    });
  }

  async findAll(usuarioId: number) {
    return this.prisma.encargado.findMany({
      where: { usuarioId },
      include: {
        rubros: true,  // Incluye los rubros del encargado
      },
    });
  }

  async findOne(id: number, usuarioId: number) {
    const encargado = await this.prisma.encargado.findFirst({
      where: { 
        id,
        usuarioId 
      },
      include: {
        rubros: true,
      },
    });

    if (!encargado) {
      throw new NotFoundException(`Encargado con id ${id} no encontrado o no tenés acceso`);
    }

    return encargado;
  }

  async update(id: number, updateEncargadoDto: UpdateEncargadoDto, usuarioId: number) {
    await this.findOne(id, usuarioId);

    const { rubroIds, ...encargadoData } = updateEncargadoDto;

    return this.prisma.encargado.update({
      where: { id },
      data: {
        ...encargadoData,
        ...(rubroIds && {
          rubros: {
            set: rubroIds.map(id => ({ id }))  // Reemplaza los rubros
          }
        })
      },
      include: {
        rubros: true
      }
    });
}

  async remove(id: number, usuarioId: number) {
    await this.findOne(id, usuarioId);

    return this.prisma.encargado.delete({
      where: { id },
    });
  }
}