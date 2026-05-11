import { Test, TestingModule } from '@nestjs/testing';
import { ManoDeObraController } from './mano-de-obra.controller';
import { ManoDeObraService } from './mano-de-obra.service';

describe('ManoDeObraController', () => {
  let controller: ManoDeObraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManoDeObraController],
      providers: [ManoDeObraService],
    }).compile();

    controller = module.get<ManoDeObraController>(ManoDeObraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
