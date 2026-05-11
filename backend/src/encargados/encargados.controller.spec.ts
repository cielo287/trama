import { Test, TestingModule } from '@nestjs/testing';
import { EncargadosController } from './encargados.controller';
import { EncargadosService } from './encargados.service';

describe('EncargadosController', () => {
  let controller: EncargadosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EncargadosController],
      providers: [EncargadosService],
    }).compile();

    controller = module.get<EncargadosController>(EncargadosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
