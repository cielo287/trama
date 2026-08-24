import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TareasModule } from './tareas/tareas.module';
import { PrismaModule } from './prisma/prisma.module';
import { ObrasModule } from './obras/obras.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { MaterialesModule } from './materiales/materiales.module';
import { EncargadosModule } from './encargados/encargados.module';
import { DetallesMaterialModule } from './detalles-material/detalles-material.module';
import { ManoDeObraModule } from './mano-de-obra/mano-de-obra.module';
import { MailService } from './mail/mail.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 20 }]),
    TareasModule,
    PrismaModule,
    ObrasModule,
    UsuariosModule,
    AuthModule,
    MaterialesModule,
    EncargadosModule,
    DetallesMaterialModule,
    ManoDeObraModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    MailService,
    {provide: APP_GUARD, useClass: ThrottlerGuard}],
})
export class AppModule {}