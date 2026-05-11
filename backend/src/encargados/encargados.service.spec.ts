import { Test, TestingModule } from '@nestjs/testing';
import { EncargadosService } from './encargados.service';

describe('EncargadosService', () => {
  let service: EncargadosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncargadosService],
    }).compile();

    service = module.get<EncargadosService>(EncargadosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
