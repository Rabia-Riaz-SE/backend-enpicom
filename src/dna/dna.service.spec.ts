import { Test, TestingModule } from '@nestjs/testing';
import { DNAService } from './dna.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { DNA } from './entity/dna.entity';
import { CreateDNADto, SearchDNADto, DNADto } from './dto';
import { HttpException } from '@nestjs/common';
import { DNATestData } from '../../test/dnaTestData'
import { DNATestDataInterface, ErrorTypeDto } from '../../test/testUtils';

// Mock Repository
const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
});

describe('DNAService', () => {
  let service: DNAService;
  let repository: Repository<DNA>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DNAService,
        { provide: getRepositoryToken(DNA), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<DNAService>(DNAService);
    repository = module.get<Repository<DNA>>(getRepositoryToken(DNA));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new DNA record', async () => {
      const data: DNATestDataInterface<CreateDNADto, DNADto> = DNATestData.createDNADto;

      repository.findOne = jest.fn().mockResolvedValue(null);
      repository.save = jest.fn().mockResolvedValue(data.response);

      const result = await service.create(data.query);
      expect(result).toEqual(data.response);
      expect(repository.save).toHaveBeenCalledWith(data.query);
    });

    it('should throw an error if DNA already exists', async () => {
      const data: DNATestDataInterface<CreateDNADto, ErrorTypeDto> = DNATestData.duplicateDNA;
      const existingRecord: DNADto = DNATestData.createDNADto.response;

      repository.findOne = jest.fn().mockResolvedValue(existingRecord);

      await expect(service.create(data.query)).rejects.toThrow(new HttpException(data.response.message,
        +data.response.statusCode));
    });
  });

  describe('find', () => {
    it('should return matched DNA records if valid search and levenshtein distance are provided', async () => {
      const data: DNATestDataInterface<SearchDNADto, DNADto[]> = DNATestData.searchDNADto;

      repository.find = jest.fn().mockResolvedValue(data.response);

      const result = await service.find(data.query);
      expect(result).toEqual(data.response);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should throw an error if levenshtein distance is not a number', async () => {
      const data:DNATestDataInterface <SearchDNADto, ErrorTypeDto> = DNATestData.searchDNADtoWithInvalidLevenshtein;

      await expect(service.find(data.query)).rejects.toThrow(new HttpException(data.response.message,
        +data.response.statusCode));
    });

    it('should return all matched records matching DNA is empty, levenshtein distance is provided', async () => {

      const mockDNAs: DNADto[] = DNATestData.mockDNAs;
      const data: DNATestDataInterface<SearchDNADto, DNADto[] > = DNATestData.searchDNADtoWithEmptyDNA

      repository.find = jest.fn().mockResolvedValue(mockDNAs);

      const result = await service.find(data.query);
      expect(result).toEqual(data.response);
      expect(repository.find).toHaveBeenCalledWith()

    });

    it('should return all records matching DNA if levenshtein distance is not provided', async () => {
      const data: DNATestDataInterface<SearchDNADto, DNADto[] > = DNATestData.searchDNADtoWithNoLevenshtein

      repository.find = jest.fn().mockResolvedValue(data.response);

      const result = await service.find(data.query);
      expect(result).toEqual(data.response);
      expect(repository.find).toHaveBeenCalledWith({
        where: { DNA: Like(`${data.query.DNA.toUpperCase()}%`) }
      }
      );
    });

    it('should return all records both DNA and levenshtein distance are not provided', async () => {
      const searchDNADto: SearchDNADto = {};
      const mockDNAs: DNADto[] = DNATestData.mockDNAs;
      const emptyString = ''

      repository.find = jest.fn().mockResolvedValue(mockDNAs);

      const result = await service.find(searchDNADto);
      expect(result).toEqual(mockDNAs);
      expect(repository.find).toHaveBeenCalledWith({
        where: { DNA: Like(`%${emptyString}`) }
      }
      );
    });
  });
});