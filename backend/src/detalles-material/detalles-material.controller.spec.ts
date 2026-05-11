import { Test, TestingModule } from '@nestjs/testing';
import { DetallesMaterialController } from './detalles-material.controller';
import { DetallesMaterialService } from './detalles-material.service';

describe('DetallesMaterialController', () => {
  let controller: DetallesMaterialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetallesMaterialController],
      providers: [DetallesMaterialService],
    }).compile();

    controller = module.get<DetallesMaterialController>(DetallesMaterialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
