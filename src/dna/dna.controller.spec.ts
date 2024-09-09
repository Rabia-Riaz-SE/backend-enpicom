import { Test, TestingModule } from '@nestjs/testing';
import { DNAController } from './dna.controller';
import { DNAService } from './dna.service';
import { CreateDNADto, SearchDNADto } from './dto';
import { DNAControllerTestData } from '../../test/dnaTestData';

describe('DNAController', () => {
  let dnaController: DNAController;
  let dnaService: DNAService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DNAController],
      providers: [
        {
          provide: DNAService,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    dnaController = module.get<DNAController>(DNAController);
    dnaService = module.get<DNAService>(DNAService);
  });

  // Create DNA
  describe('create', () => {
    it('should create a new DNA record', async () => {
      const dnaData: CreateDNADto = DNAControllerTestData.createDNADto;
      const expectedResult = DNAControllerTestData.createDNADto_res;

      (dnaService.create as jest.Mock).mockResolvedValue(expectedResult);

      const result = await dnaController.create(dnaData);
      expect(result).toEqual(expectedResult);
      expect(dnaService.create).toHaveBeenCalledWith(dnaData);
    });

    it('should return validation error if DNA is empty', async () => {
      const invalidDNAData: CreateDNADto = DNAControllerTestData.createDNADtoEmpty;

      try {
        await dnaController.create(invalidDNAData);
      } catch (error) {
        expect(error.status).toBe(DNAControllerTestData.createDNADtoEmptyRes.statusCode);
        expect(error.response.message).toContain(DNAControllerTestData.createDNADtoEmptyRes.message);
        expect(error.response.error).toBe(DNAControllerTestData.createDNADtoEmptyRes.error);
      }

    });

    it('should return validation error if DNA contains invalid characters', async () => {
      const invalidDNAData: CreateDNADto = DNAControllerTestData.createDNADtoInvalid;
      try {
      await dnaController.create(invalidDNAData)
      }catch (error) {
        expect(error.status).toBe(DNAControllerTestData.createDNADtoInvalidRes.statusCode);
        expect(error.response.message).toContain(DNAControllerTestData.createDNADtoInvalidRes.message);
        expect(error.response.error).toBe(DNAControllerTestData.createDNADtoInvalidRes.error);
      }
    });
  });

  // Search DNA
  describe('search', () => {
    it('should return a list of DNA records', async () => {
      const searchQuery: SearchDNADto = DNAControllerTestData.searchDNADto;
      const expectedResult = DNAControllerTestData.searchDNADto_res;

      (dnaService.find as jest.Mock).mockResolvedValue(expectedResult);

      const result = await dnaController.find(searchQuery.DNA, searchQuery.levenshtein);
      expect(result).toEqual(expectedResult);
      expect(dnaService.find).toHaveBeenCalledWith(searchQuery);
    });

    it('should return an empty array if no records are found', async () => {
      const searchQuery: SearchDNADto = DNAControllerTestData.searchDNADto;
      const expectedResult: any[] = [];

      (dnaService.find as jest.Mock).mockResolvedValue(expectedResult);

      const result = await dnaController.find(searchQuery.DNA, searchQuery.levenshtein);
      expect(result).toEqual(expectedResult);
      expect(dnaService.find).toHaveBeenCalledWith(searchQuery);
    });

    it('should return all matched records if only the search argument is passed', async () => {
      const query = { DNA: DNAControllerTestData.searchDNADto.DNA, levenshtein: 0 };
      const expectedResult = DNAControllerTestData.searchDNADto_res;

      (dnaService.find as jest.Mock).mockResolvedValue(expectedResult);

      const result = await dnaController.find(query.DNA);
      expect(result).toEqual(expectedResult);
      expect(dnaService.find).toHaveBeenCalledWith(query);
    });

    it('should return all records if an empty string is passed as an argument', async () => {
      const query = { DNA: '', levenshtein: 0 };
      const expectedResult = DNAControllerTestData.searchDNADto_res;

      (dnaService.find as jest.Mock).mockResolvedValue(expectedResult);

      const result = await dnaController.find('');
      expect(result).toEqual(expectedResult);
      expect(dnaService.find).toHaveBeenCalledWith(query);
    });
  });
});
