import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { PrismaService } from '../prisma/prisma.service';

function toDate(date?: string | Date | null): Date | undefined {
  if (!date) return undefined
  return new Date(date)
}

@Injectable()
export class TareasService {
  constructor(private prisma: PrismaService) {}

  async create(createTareaDto: CreateTareaDto, usuarioId: number) {
    const obra = await this.prisma.obra.findFirst({
      where: { id: createTareaDto.obraId, usuarioId }
    });
    if (!obra) {
      throw new NotFoundException(`Obra con id ${createTareaDto.obraId} no encontrada`)
    }

    const {fechaInicio, fechaFin} = createTareaDto
    if (fechaInicio && fechaFin) 
      if (fechaInicio > fechaFin) {
        throw new BadRequestException('La fecha de inicio no puede ser posterior a la fecha de fin')
      }

    if (createTareaDto.tareaPadreId) {
      const tareaPadre = await this.prisma.tarea.findFirst({
        where: {
          id: createTareaDto.tareaPadreId,
          obraId: createTareaDto.obraId,
          obra: { usuarioId }
        }
      });
      if (!tareaPadre) {
        throw new NotFoundException(`Tarea padre con id ${createTareaDto.tareaPadreId} no encontrada o pertenece a otra obra`)
      }
      if (tareaPadre.tareaPadreId) {
        throw new BadRequestException(`La tarea padre con id ${createTareaDto.tareaPadreId} es una subtarea y no puede tener subtareas`)
      }
    }

    const totalTareas = await this.prisma.tarea.count({
      where: { obraId: createTareaDto.obraId }
    });

    return this.prisma.tarea.create({
      data: {
        ...createTareaDto,
        ordenEjecucion: totalTareas + 1,
        fechaInicio: toDate(createTareaDto.fechaInicio),
        fechaFin: toDate(createTareaDto.fechaFin),
      },
    });
  }

  async findAll(usuarioId: number) {
    return this.prisma.tarea.findMany({
      where: {
        obra: { usuarioId }
      },
      include: {
        obra: true,
        tareaPadre: true,
        subtareas: true,
      },
    });
  }

  async findOne(id: number, usuarioId: number) {
    const tarea = await this.prisma.tarea.findFirst({
      where: {
        id,
        obra: { usuarioId }
      },
      include: {
        obra: true,
        tareaPadre: true,
        subtareas: true,
        detallesMaterial: {
          include: {
            material: true,
          },
        },
        manoDeObra: {
          include: {
            encargado: true,
          },
        },
      },
    });

    if (!tarea) {
      throw new NotFoundException(`Tarea con id ${id} no encontrada o no tenés acceso`);
    }

    return tarea;
  }

async update(id: number, updateTareaDto: UpdateTareaDto, usuarioId: number) {
  await this.findOne(id, usuarioId);

  const tarea = await this.prisma.tarea.findUnique({
    where: { id },
  });

  if (!tarea) {
    throw new NotFoundException('Tarea no encontrada');
  }

  // 🔹 combinar DTO + DB para validar
  const fechaInicio = updateTareaDto.fechaInicio ?? tarea.fechaInicio;
  const fechaFin = updateTareaDto.fechaFin ?? tarea.fechaFin;

  // ❌ no permitir fin sin inicio
  if (!fechaInicio && fechaFin) {
    throw new BadRequestException(
      'La fecha de fin no puede existir sin una fecha de inicio'
    );
  }

  // ❌ coherencia de fechas
  if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
    throw new BadRequestException(
      'La fecha de inicio no puede ser posterior a la fecha de fin'
    );
  }

  // 🔹 armar data solo con lo que viene
  const data: any = {
    ...updateTareaDto,
  };

  if (updateTareaDto.fechaInicio !== undefined) {
    data.fechaInicio = updateTareaDto.fechaInicio
      ? toDate(updateTareaDto.fechaInicio)
      : null; // permite borrar si mandan null
  }

  if (updateTareaDto.fechaFin !== undefined) {
    data.fechaFin = updateTareaDto.fechaFin
      ? toDate(updateTareaDto.fechaFin)
      : null;
  }

  return this.prisma.tarea.update({
    where: { id },
    data,
  });
}

  async remove(id: number, usuarioId: number) {
    await this.findOne(id, usuarioId);
    return this.prisma.tarea.delete({
      where: { id },
    });
}

async reorder(
  orden: { id: number; orden: number }[],
  usuarioId: number
) {
  const ids = orden.map(o => o.id);

  const tareas = await this.prisma.tarea.findMany({
    where: {
      id: { in: ids },
      obra: { usuarioId }
    }
  });

  if (tareas.length !== ids.length) {
    throw new NotFoundException(
      'Algunas tareas no existen o no pertenecen al usuario'
    );
  }

  await this.prisma.$transaction(
    orden.map(o =>
      this.prisma.tarea.update({
        where: { id: o.id },
        data: { ordenEjecucion: o.orden }
      })
    )
  );
}
}