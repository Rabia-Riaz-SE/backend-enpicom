import { Test, TestingModule } from '@nestjs/testing';
import { DNAService } from './dna.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { DNA } from './entity/dna.entity';
import { CreateDNADto, SearchDNADto, DNADto } from './dto';
import { HttpException } from '@nestjs/common';
import { DNATestData } from '../../test/dnaTestData'

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
      const createDto: CreateDNADto = DNATestData.createDNADto;
      const createdRecord: DNADto = DNATestData.createDNADtoRes;

      repository.findOne = jest.fn().mockResolvedValue(null);
      repository.save = jest.fn().mockResolvedValue(createdRecord);

      const result = await service.create(createDto);
      expect(result).toEqual(createdRecord);
      expect(repository.save).toHaveBeenCalledWith(createDto);
    });

    it('should throw an error if DNA already exists', async () => {
      const createDto: CreateDNADto = DNATestData.createDNADto;;
      const existingRecord: DNADto = DNATestData.createDNADtoRes;

      repository.findOne = jest.fn().mockResolvedValue(existingRecord);

      await expect(service.create(createDto)).rejects.toThrow(new HttpException(DNATestData.duplicateDNARes.message,
         DNATestData.duplicateDNARes.HttpStatus));
    });
  });

  describe('find', () => {
    it('should return matched DNA records if valid search and levenshtein distance are provided', async () => {
      const searchDto: SearchDNADto = DNATestData.searchDNADto;
      const mockDNAs: DNADto[] = DNATestData.searchDNADtoRes;

      repository.find = jest.fn().mockResolvedValue(mockDNAs);

      const result = await service.find(searchDto);
      expect(result).toEqual(mockDNAs);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should throw an error if levenshtein distance is not a number', async () => {
      const searchDto: SearchDNADto = DNATestData.searchDNADtoLevenshteinNaN;

      await expect(service.find(searchDto)).rejects.toThrow(new HttpException(DNATestData.searchDNADtoLevenshteinNaNRes.message,
         DNATestData.searchDNADtoLevenshteinNaNRes.HttpStatus));
    });

    it('should return all matched records matching DNA is empty, levenshtein distance is provided', async () => {
      const searchDto: SearchDNADto = DNATestData.SearchDNADtoEmptyDNA
      const mockDNAs: DNADto[] = DNATestData.mockDNAs;
      const response: DNADto[] = DNATestData.SearchDNADtoEmptyDNARes;

      repository.find = jest.fn().mockResolvedValue(mockDNAs);

      const result = await service.find(searchDto);
      expect(result).toEqual(response);
      expect(repository.find).toHaveBeenCalledWith()

    });

    it('should return all records matching DNA if levenshtein distance is not provided', async () => {
      const searchDNADto: SearchDNADto = DNATestData.SearchDNADtoWithoutLevenshtein;
      const mockDNAs: DNADto[] = DNATestData.SearchDNADtoWithoutLevenshteinRes;

      repository.find = jest.fn().mockResolvedValue(mockDNAs);

      const result = await service.find(searchDNADto);
      expect(result).toEqual(mockDNAs);
      expect(repository.find).toHaveBeenCalledWith({
        where: { DNA: Like(`${searchDNADto.DNA.toUpperCase()}%`) }}
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
        where: { DNA: Like(`%${emptyString}`) }}
      );
    });
  });
});