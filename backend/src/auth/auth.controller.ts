import { Controller, Post, Body, Get, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import type { Response } from 'express';
import { Res } from '@nestjs/common';
import { CurrentUser } from './decorators/decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/guards/jwt-auth.guard';
import type { Request } from 'express';
import { VerificarCodigoDto } from './dto/verificacion-dto.dto';
import { ReenviarCodigoDto } from './dto/reenviar-codigo.dto';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  

  @Post('register')
  async register(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.authService.register(createUsuarioDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: { email: string; password: string, device?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(loginDto.email, loginDto.password, loginDto.device);
    res.cookie('access_token', token.access_token, cookieOptions);
    res.cookie('refresh_token', token.refresh_token, cookieOptions);
    return token.user;
  }

  
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: Request,
    @CurrentUser() user: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie('refresh_token');
    res.clearCookie('access_token');

    return { message: 'Logout ok' };
  }
  
@Get('me')
@UseGuards(JwtAuthGuard)
async me(@CurrentUser() user: any) {
  return this.authService.findMe(user.userId);
}

@Post('refresh')
async refresh(
  @Req() req: Request, 
  @Res({ passthrough: true }) res: Response
) {
  const oldToken = req.cookies?.refresh_token;
  if (!oldToken) throw new UnauthorizedException('No refresh token provided');

  try {
    const tokens = await this.authService.refresh(oldToken);

    res.cookie('access_token', tokens.access_token, cookieOptions);
    res.cookie('refresh_token', tokens.refresh_token, cookieOptions);

    return { message: 'Tokens renewed' };
  } catch (error) {
    
    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);
    throw error; 
  }
}

@Post('verificar')
async verificar(@Body() dto: VerificarCodigoDto) {
  return this.authService.verificarCodigo(dto.email, dto.codigo);
}

@Post('reenviar-codigo')
async reenviarCodigo(@Body() dto: ReenviarCodigoDto) {
  return this.authService.reenviarCodigo(dto.email);
}

}

  

