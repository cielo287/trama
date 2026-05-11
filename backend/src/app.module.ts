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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
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
  providers: [AppService],
})
export class AppModule {}