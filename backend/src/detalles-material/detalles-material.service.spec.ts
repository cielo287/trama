import { Test, TestingModule } from '@nestjs/testing';
import { DetallesMaterialService } from './detalles-material.service';

describe('DetallesMaterialService', () => {
  let service: DetallesMaterialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetallesMaterialService],
    }).compile();

    service = module.get<DetallesMaterialService>(DetallesMaterialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
