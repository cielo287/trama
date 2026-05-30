import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoTarea } from './enums/tareas.enums';
import { TRANSICIONES_VALIDAS } from './state/state';
import { CreateDetalleMaterialDto } from './dto/create-detalle-material.dto';
import { CreateManoDeObraDto } from './dto/create-mano-de-obra.dto';

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

async cambiarEstado(tareaId: number, nuevoEstado: EstadoTarea, usuarioId: number, notas?: string) {
    // 1. Buscamos la tarea con sus subtareas
  const tarea = await this.prisma.tarea.findFirst({
    where: { 
      id: tareaId,
      obra: {
        usuarioId
      }
    },
    include: { 
      subtareas: {
        select: { estado: true }
      }
    },
  });

    if (!tarea) {
      throw new NotFoundException(`La tarea con ID ${tareaId} no existe.`);
    }

    const estadoActual = tarea.estado as EstadoTarea;

    // 2. Validamos la transición con nuestra máquina de estados
    const permitidos = TRANSICIONES_VALIDAS[estadoActual];
    if (!permitidos.includes(nuevoEstado)) {
      throw new BadRequestException(
        `No se puede cambiar el estado de ${estadoActual} a ${nuevoEstado}.`,
      );
    }

    // 3. Regla de negocio: No se puede finalizar si tiene subtareas abiertas
    if (nuevoEstado === EstadoTarea.FINALIZADA) {
      const tieneHijosAbiertos = tarea.subtareas.some(
        (sub) => sub.estado !== EstadoTarea.FINALIZADA,
      );
      if (tieneHijosAbiertos) {
        throw new BadRequestException(
          'No podés finalizar esta tarea porque tiene subtareas pendientes de terminar.',
        );
      }
    }

    // 4. Usamos una transacción de Prisma para asegurar que se actualice la tarea
    // y se cree el historial en un solo bloque (si uno falla, no se hace nada)
    return this.prisma.$transaction(async (tx) => {
      const ahora = new Date();

      // A. Cerramos el registro anterior en el historial si existía alguno abierto
      await tx.historialEstado.updateMany({
        where: {
          tareaId: tareaId,
          fechaFin: null,
        },
        data: {
          fechaFin: ahora,
        },
      });

      // B. Creamos el nuevo registro en el historial de estados
      await tx.historialEstado.create({
        data: {
          estado: nuevoEstado,
          fechaInicio: ahora,
          notas: notas || null,
          tareaId: tareaId,
        },
      });

      // C. Actualizamos el estado físico de la tarea
      return tx.tarea.update({
        where: { id: tareaId },
        data: { estado: nuevoEstado },
      });
    });
  }

  async crearDetalleMaterial(tareaId: number, createDetalleMaterialDto: CreateDetalleMaterialDto, usuarioId: number) {
    const tarea = await this.prisma.tarea.findFirst({
      where: {
        id: tareaId,
        obra: { usuarioId }
      }
    });
    if (!tarea) {
      throw new NotFoundException(`Tarea con id ${tareaId} no encontrada o no tenés acceso`);
    }

    let material = await this.prisma.material.findFirst({
      where: {
        nombre: createDetalleMaterialDto.nombre,
        usuarioId
      }
    });

    if (!material) {
      material = await this.prisma.material.create({
        data: {
          nombre: createDetalleMaterialDto.nombre,
          usuarioId,
        }
      })
    }
    return this.prisma.detalleMaterial.create({
      data: {
        tareaId: tareaId,
        materialId: material.id,
        cantidad: createDetalleMaterialDto.cantidad,
        precioUnitario: createDetalleMaterialDto.precioUnitario,
        unidadDeMedida: createDetalleMaterialDto.unidadDeMedida,
      },
      include: {
        material: true,
      }
    })
  }

  async crearManoDeObra(tareaId: number, encargadoDto: CreateManoDeObraDto, usuarioId: number) {
    const tarea = await this.prisma.tarea.findFirst({
      where: {
        id: tareaId,
        obra: { usuarioId }
      }
    });
    if (!tarea) {
      throw new NotFoundException(`Tarea con id ${tareaId} no encontrada o no tenés acceso`);
    }

    const telefonoNormalizado = this.normalizarTelefono(encargadoDto.telefono);

    let encargado = await this.prisma.encargado.findFirst({
      where: {
        telefono: telefonoNormalizado,
        usuarioId
      }
    });

    if (!encargado) {
      encargado = await this.prisma.encargado.create({
        data: {
          nombre: encargadoDto.nombre,
          apellido: encargadoDto.apellido,
          telefono: telefonoNormalizado,
          usuarioId,
        }
      })
    }
    return this.prisma.manoDeObra.create({
      data: {
        tareaId: tareaId,
        encargadoId: encargado.id,
        precio: encargadoDto.precio,
      },
      include: {
        encargado: true,
      }
    });
  }

  async editarDetalleMaterial(tareaId: number, detalleMaterialId: number, updateDetalleMaterialDto: CreateDetalleMaterialDto, usuarioId: number) {
    const detalle = await this.prisma.detalleMaterial.findFirst({
      where: {
        id: detalleMaterialId,
        tareaId,
        tarea: {
          obra: { usuarioId }
        }
      }
    });
    if (!detalle) {
      throw new NotFoundException(`Detalle de material con id ${detalleMaterialId} no encontrado o no tenés acceso`);
    }

    let material = await this.prisma.material.findFirst({
      where: {
        nombre: updateDetalleMaterialDto.nombre,
        usuarioId
      }
    });

    if (!material) {
      material = await this.prisma.material.create({
        data: {
          nombre: updateDetalleMaterialDto.nombre,
          usuarioId
        }
      })
    }

    return this.prisma.detalleMaterial.update({
      where: { id: detalleMaterialId },
      data: {
        materialId: material.id,
        cantidad: updateDetalleMaterialDto.cantidad,
        precioUnitario: updateDetalleMaterialDto.precioUnitario,
        unidadDeMedida: updateDetalleMaterialDto.unidadDeMedida,
      },
      include: {
        material: true,
      }
    });
  }

  async editarManoDeObra(tareaId: number, manoDeObraId: number, updateManoDeObraDto: CreateManoDeObraDto, usuarioId: number) {
    const mano = await this.prisma.manoDeObra.findFirst({
      where: {
        id: manoDeObraId,
       tareaId,
        tarea: {
          obra: { usuarioId }
        }
      }
    });
    if (!mano) {
      throw new NotFoundException(`Mano de obra con id ${manoDeObraId} no encontrada o no tenés acceso`);
    }

    const telefonoNormalizado = this.normalizarTelefono(updateManoDeObraDto.telefono);

    let encargado = await this.prisma.encargado.findFirst({
      where: {
        telefono: telefonoNormalizado,
        usuarioId
      }
    });

    if (!encargado) {
      encargado = await this.prisma.encargado.create({
        data: {
          nombre: updateManoDeObraDto.nombre,
          apellido: updateManoDeObraDto.apellido,
          telefono: telefonoNormalizado,
          usuarioId,
        }
      })
    }

    return this.prisma.manoDeObra.update({
      where: { id: manoDeObraId },
      data: {
        encargadoId: encargado.id,
        precio: updateManoDeObraDto.precio,
      },
      include: {
        encargado: true,
      }
    });
  }

  private normalizarTelefono(telefono: string): string {
    // Eliminar espacios, guiones y paréntesis
    return telefono.replace(/[\s\-()]/g, '');
  }
}
