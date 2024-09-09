import { Test, TestingModule } from '@nestjs/testing';
import { DNAService } from './dna.service';

describe('DnaService', () => {
  let service: DNAService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DNAService],
    }).compile();

    service = module.get<DNAService>(DNAService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
