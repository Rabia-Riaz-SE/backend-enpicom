import { Test, TestingModule } from '@nestjs/testing';
import { DNAController } from './dna.controller';
import { DNAService } from './dna.service';
import { CreateDNADto, SearchDNADto , DNADto} from './dto';
import { DNATestData } from '../../test/dnaTestData';
import { DNATestDataInterface, ErrorTypeDto } from '../../test/testUtils';

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
      const data: DNATestDataInterface<CreateDNADto, DNADto> = DNATestData.createDNADto;

      (dnaService.create as jest.Mock).mockResolvedValue(data.response);

      const result = await dnaController.create(data.query);
      expect(result).toEqual(data.response);
      expect(dnaService.create).toHaveBeenCalledWith(data.query);
    });

    it('should return validation error if DNA is empty', async () => {
      const data: DNATestDataInterface<CreateDNADto, ErrorTypeDto> = DNATestData.createDNADtoEmpty;

      try {
        await dnaController.create(data.query);
      } catch (error) {
        expect(error.status).toBe(data.response.statusCode);
        expect(error.response.message).toContain(data.response.message);
        expect(error.response.error).toBe(data.response.error);
      }

    });

    it('should return validation error if DNA contains invalid characters', async () => {
      const data: DNATestDataInterface<CreateDNADto, ErrorTypeDto> = DNATestData.createDNADtoInvalid;

      try {
      await dnaController.create(data.query)
      }catch (error) {
        expect(error.status).toBe(data.response.statusCode);
        expect(error.response.message).toContain(data.response.message);
        expect(error.response.error).toBe(data.response.error);
      }
    });
  });

  // Search DNA
  describe('search', () => {
    it('should return a list of DNA records', async () => {
      const data: DNATestDataInterface<SearchDNADto, DNADto[]> = DNATestData.searchDNADto;

      (dnaService.find as jest.Mock).mockResolvedValue(data.response);

      const result = await dnaController.find(data.query.DNA, data.query.levenshtein);
      expect(result).toEqual(data.response);
      expect(dnaService.find).toHaveBeenCalledWith(data.query);
    });

    it('should return an empty array if no records are found', async () => {
      const data: DNATestDataInterface<SearchDNADto, DNADto[]> = DNATestData.searchDNADto;
      const expectedResult: any[] = [];

      (dnaService.find as jest.Mock).mockResolvedValue(expectedResult);

      const result = await dnaController.find(data.query.DNA, data.query.levenshtein);
      expect(result).toEqual(expectedResult);
      expect(dnaService.find).toHaveBeenCalledWith(data.query);
    });

    it('should return all matched records if only the search argument is passed', async () => {
      const res = {"DNA": DNATestData.searchDNADto.query.DNA, "levenshtein": undefined};
      const data: DNATestDataInterface<SearchDNADto, DNADto[]> = DNATestData.searchDNADto;

      (dnaService.find as jest.Mock).mockResolvedValue(data.response);

      const result = await dnaController.find(data.query.DNA);
      expect(result).toEqual(data.response);
      expect(dnaService.find).toHaveBeenCalledWith(res);
    });

    it('should return all records if an empty string is passed as an argument', async () => {
      const res = {"DNA": "", "levenshtein": undefined};
      const data: DNATestDataInterface<SearchDNADto, DNADto[]> = DNATestData.searchDNADto;

      (dnaService.find as jest.Mock).mockResolvedValue(data.response);

      const result = await dnaController.find('');
      expect(result).toEqual(data.response);
      expect(dnaService.find).toHaveBeenCalledWith(res);
    });
  });
});
