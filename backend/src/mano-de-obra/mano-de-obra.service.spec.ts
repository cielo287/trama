import { Test, TestingModule } from '@nestjs/testing';
import { ManoDeObraService } from './mano-de-obra.service';

describe('ManoDeObraService', () => {
  let service: ManoDeObraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManoDeObraService],
    }).compile();

    service = module.get<ManoDeObraService>(ManoDeObraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
