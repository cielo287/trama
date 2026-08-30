import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto'
import { randomUUID } from 'crypto';

function generarCodigoVerificacion(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
}



@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  private readonly MAX_INTENTOS_LOGIN = 5
  private readonly BLOQUEO_LOGIN_MS = 15 * 60 * 1000
  private readonly MAX_INTENTOS_CODIGO = 5
  private readonly BLOQUEO_CODIGO_MS = 15 * 60 * 1000

async validateUser(email: string, password: string): Promise<any> {
  const user = await this.usuariosService.findByEmail(email);
  if (!user) throw new UnauthorizedException('Credenciales inválidas');

  if (user.bloqueadoHastaLogin && user.bloqueadoHastaLogin > new Date()) {
    const minutosRestantes = Math.ceil((user.bloqueadoHastaLogin.getTime() - Date.now()) / 60000)
    throw new UnauthorizedException({
      code: 'LOGIN_BLOQUEADO',
      message: `Demasiados intentos fallidos. Probá de nuevo en ${minutosRestantes} min`,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const intentos = user.intentosFallidosLogin + 1
    const data: any = { intentosFallidosLogin: intentos }

    if (intentos >= this.MAX_INTENTOS_LOGIN) {
      data.bloqueadoHastaLogin = new Date(Date.now() + this.BLOQUEO_LOGIN_MS)
      data.intentosFallidosLogin = 0 // reinicia el contador junto con el bloqueo
    }

    await this.prisma.usuario.update({ where: { id: user.id }, data })
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // Login correcto: resetear contador si tenía intentos previos
  if (user.intentosFallidosLogin > 0) {
    await this.prisma.usuario.update({
      where: { id: user.id },
      data: { intentosFallidosLogin: 0, bloqueadoHastaLogin: null },
    })
  }

  const { password: _, ...result } = user;
  return result;
}

  async login(email: string, password: string, device?: string) {
    const user = await this.validateUser(email, password);

    const uuid = randomUUID()

    const payload = { email: user.email, sub: user.id, jti: uuid }
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' })
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' })
    const hashedToken = await bcrypt.hash(refresh_token, 10)

  if (!user.verificado) {
    throw new UnauthorizedException({
    code: 'UNVERIFIED',
    message: 'Tenés que verificar tu cuenta antes de ingresar',
  });
  }

    await this.prisma.refreshToken.create({
      data: {
        uuid,
        userId: user.id,
        device,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    return { access_token, refresh_token, user }
  }


async register(createUsuarioDto: any) {
  const codigo = generarCodigoVerificacion();
  const expiracion = new Date(Date.now() + 15 * 60 * 1000);

  const user = await this.usuariosService.create(createUsuarioDto, {
    codigoVerificacion: codigo,
    codigoExpiracion: expiracion,
  });

  const { password, codigoVerificacion, ...result } = user;

  try {
    await this.mailService.enviarCodigoVerificacion(user.email, codigo);
  } catch (error) {
    console.error('Error enviando mail de verificación:', error);
  }

  return result;
}
  async refresh(oldToken: string) {
    let payload: { jti: string; sub: number; email: string };

    try {
      payload = this.jwtService.verify(oldToken);
    } catch {
      throw new UnauthorizedException('Token inválido');
    }

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { uuid: payload.jti },
    });

    if (!storedToken) throw new UnauthorizedException('Token inválido');


    if (storedToken.expiresAt < new Date()) {
      await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedException('Token expirado');
    }

    const isTokenValid = await bcrypt.compare(oldToken, storedToken.token);
    if (!isTokenValid) {
      throw new UnauthorizedException('Token inválido');
    }

    // Rotación — borramos el viejo
    await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

    const uuid = randomUUID()

    const newPayload = { email: payload.email, sub: payload.sub, jti: uuid }
    const access_token = this.jwtService.sign(newPayload, { expiresIn: '15m' })
    const refresh_token = this.jwtService.sign(newPayload, { expiresIn: '7d' })
    const hashedNew = await bcrypt.hash(refresh_token, 10)

    // Un solo viaje a la DB
    await this.prisma.refreshToken.create({
      data: {
        uuid,
        userId: payload.sub,
        device: storedToken.device,
        token: hashedNew,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    return { access_token, refresh_token }
  }

  async logout(refreshToken: string) {
    let payload: { jti: string };

    try {
      payload = this.jwtService.verify(refreshToken, { ignoreExpiration: true });
    } catch {
      throw new UnauthorizedException('Token inválido');
    }

    try {
      await this.prisma.refreshToken.delete({
        where: { uuid: payload.jti },
      });
    } catch (error: any) {
      if (error.code === 'P2025') return { message: 'Logout exitoso' };
      throw new InternalServerErrorException('Error al procesar el logout');
    }

    return { message: 'Logout exitoso' };
  }

  async findMe(userId: number) {
    return this.prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

async verificarCodigo(email: string, codigo: string) {
  const user = await this.usuariosService.findByEmail(email);

  if (!user) throw new UnauthorizedException('Usuario no encontrado');

  if (user.verificado) {
    return { message: 'La cuenta ya estaba verificada' };
  }

  if (user.bloqueadoHastaCodigo && user.bloqueadoHastaCodigo > new Date()) {
    const minutosRestantes = Math.ceil((user.bloqueadoHastaCodigo.getTime() - Date.now()) / 60000)
    throw new UnauthorizedException({
      code: 'CODIGO_BLOQUEADO',
      message: `Demasiados intentos. Probá de nuevo en ${minutosRestantes} min`});
  }

  if (!user.codigoVerificacion || !user.codigoExpiracion) {
    throw new UnauthorizedException('No hay un código pendiente para este usuario');
  }

  if (user.codigoExpiracion < new Date()) {
    throw new UnauthorizedException('El código expiró, solicitá uno nuevo');
  }

  if (user.codigoVerificacion !== codigo) {
    const intentos = user.intentosFallidosCodigo + 1
    const data: any = { intentosFallidosCodigo: intentos }

    if (intentos >= this.MAX_INTENTOS_CODIGO) {
      data.bloqueadoHastaCodigo = new Date(Date.now() + this.BLOQUEO_CODIGO_MS)
      data.intentosFallidosCodigo = 0
    }

    await this.prisma.usuario.update({ where: { id: user.id }, data })
    throw new UnauthorizedException('Código incorrecto');
  }

  await this.prisma.usuario.update({
    where: { id: user.id },
    data: {
      verificado: true,
      codigoVerificacion: null,
      codigoExpiracion: null,
      intentosFallidosCodigo: 0,
      bloqueadoHastaCodigo: null,
    },
  });

  return { message: 'Cuenta verificada correctamente' };
}

async reenviarCodigo(email: string) {
  const user = await this.usuariosService.findByEmail(email);

  if (!user) throw new UnauthorizedException('Usuario no encontrado');

  if (user.verificado) {
    return { message: 'La cuenta ya estaba verificada' };
  }

  // Cooldown: si el código anterior fue generado hace menos de 60s, no generamos otro
  const ahora = new Date();
  if (user.codigoExpiracion) {
    const generadoHaceMs = 15 * 60 * 1000 - (user.codigoExpiracion.getTime() - ahora.getTime());
    if (generadoHaceMs < 60 * 1000) {
      throw new UnauthorizedException('Esperá un momento antes de pedir otro código');
    }
  }

  const codigo = generarCodigoVerificacion();
  const expiracion = new Date(ahora.getTime() + 15 * 60 * 1000);

  await this.prisma.usuario.update({
    where: { id: user.id },
    data: { 
      codigoVerificacion: codigo, 
      codigoExpiracion: expiracion,
      intentosFallidosCodigo: 0,
      bloqueadoHastaCodigo: null, },
  });

  try {
    await this.mailService.enviarCodigoVerificacion(user.email, codigo);
  } catch (error) {
    console.error('Error enviando mail de verificación:', error);
    throw new InternalServerErrorException('No se pudo enviar el código, intentá de nuevo');
  }

  return { message: 'Código reenviado' };
}


async solicitarRecuperacion(email: string) {
  const user = await this.usuariosService.findByEmail(email);

  // mismo mensaje exista o no el usuario, para no filtrar qué emails están registrados
  if (!user) return { message: 'Si el email existe, te enviamos un link' };

  // cooldown, mismo patrón que reenviarCodigo
  const ahora = new Date();
  if (user.tokenRecuperacionExpira) {
    const generadoHaceMs = 30 * 60 * 1000 - (user.tokenRecuperacionExpira.getTime() - ahora.getTime());
    if (generadoHaceMs < 60 * 1000) {
      return { message: 'Si el email existe, te enviamos un link' };
    }
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  await this.prisma.usuario.update({
    where: { id: user.id },
    data: {
      tokenRecuperacion: tokenHash,
      tokenRecuperacionExpira: new Date(ahora.getTime() + 30 * 60 * 1000),
    },
  });

  try {
    await this.mailService.enviarLinkRecuperacion(user.email, rawToken);
  } catch (error) {
    console.error('Error enviando mail de recuperación:', error);
  }

  return { message: 'Si el email existe, te enviamos un link' };
}

async resetearPassword(token: string, nuevaPassword: string) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await this.prisma.usuario.findFirst({
    where: {
      tokenRecuperacion: tokenHash,
      tokenRecuperacionExpira: { gt: new Date() },
    },
  });

  if (!user) throw new UnauthorizedException('Token inválido o expirado');

  const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

  await this.prisma.usuario.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      tokenRecuperacion: null,
      tokenRecuperacionExpira: null,
    },
  });

  return { message: 'Contraseña actualizada correctamente' };
}


}