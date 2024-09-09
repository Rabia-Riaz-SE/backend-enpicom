import { Test, TestingModule } from '@nestjs/testing';
import { DNAController } from './dna.controller';

describe('DnaController', () => {
  let controller: DNAController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DNAController],
    }).compile();

    controller = module.get<DNAController>(controllers);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
