import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateObraDto } from './dto/create-obra.dto';
import { UpdateObraDto } from './dto/update-obra.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ObrasService {
  constructor(private prisma: PrismaService) {}

async create(createObraDto: CreateObraDto, usuarioId: number) {
  return this.prisma.obra.create({
    data: {
      nombre: createObraDto.nombre,
      direccion: createObraDto.direccion,
      cliente: createObraDto.cliente,
      usuarioId: usuarioId, 
    },
  });
}

  async findAll(usuarioId: number) {
    return this.prisma.obra.findMany({
      where: {usuarioId},
      include: {
        tareas: true,
      },
    });
  }

  async findOne(id: number, usuarioId: number) {
    const obra = await this.prisma.obra.findFirst({
      where: {id, usuarioId},
      include: {
        tareas: true,
      },
    });

    if (!obra) {
      throw new NotFoundException(`Obra con id ${id} no encontrada o no tenes acceso`)
    }

    return obra;
  }

  async update(id: number, updateObraDto: UpdateObraDto, usuarioId: number) {
    await this.findOne(id, usuarioId);
    return this.prisma.obra.update({
      where: { id },
      data: updateObraDto,
    });
  }

  async remove(id: number, usuarioId: number) {
    await this.findOne(id, usuarioId);
    return this.prisma.obra.delete({
      where: { id },
    });
  }

  async findTareas(obraId: number, usuarioId: number) {

    await this.findOne(obraId, usuarioId);
    
  
    return this.prisma.tarea.findMany({
      where: { obraId },
      orderBy: { ordenEjecucion: 'asc' 
        
      },
      include: {
        tareaPadre: true,
        subtareas: true,
        bloqueadaPor: {
          include: {
            bloqueadora: true,
          }
        },
        bloquea: {
          include: {
            dependiente: true,  
          } 
        },
        detallesMaterial: {
          include: {
            material: true
          }
        },
        manoDeObra: {
          include: {
            encargado: true
          }
        }
      }
    });
  }
}