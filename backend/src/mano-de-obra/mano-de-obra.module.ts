import { Module } from '@nestjs/common';
import { ManoDeObraService } from './mano-de-obra.service';
import { ManoDeObraController } from './mano-de-obra.controller';

@Module({
  controllers: [ManoDeObraController],
  providers: [ManoDeObraService],
})
export class ManoDeObraModule {}
