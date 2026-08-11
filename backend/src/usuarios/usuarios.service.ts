import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

// usuarios.service.ts
async create(
  createUsuarioDto: CreateUsuarioDto,
  camposVerificacion?: { codigoVerificacion: string; codigoExpiracion: Date }
) {
  const existingUser = await this.prisma.usuario.findUnique(
    { where: { email: createUsuarioDto.email } }
  );

  if (existingUser) {
    throw new ConflictException('El email ya está registrado');
  }

  const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);

  return this.prisma.usuario.create({
    data: {
      ...createUsuarioDto,
      password: hashedPassword,
      ...camposVerificacion,
    },
  });
}

  async findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        createdAt: true,

      },
    });
  }

  async findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        createdAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    if (updateUsuarioDto.password) {
      updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }
    
    return this.prisma.usuario.update({
      where: { id },
      data: updateUsuarioDto,
    });
  }

  async remove(id: number) {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }

}
