import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { DNADto, CreateDNADto, SearchDNADto } from './dto';
import { DNA } from './entity/dna.entity';
import Utils from '../utils';

@Injectable()
export class DNAService {
  constructor(
    @InjectRepository(DNA) private readonly dnaRepository: Repository<DNA>,
  ) {}

  async find(searchDNA: SearchDNADto): Promise<DNADto[]> {
    try {
      // Ensure DNA is never null or undefined by assigning an empty string
      const searchQuery = searchDNA?.DNA?.toUpperCase() ?? '';

      // Validate if levenshtein is a number
      if (searchDNA?.levenshtein && isNaN(Number(searchDNA.levenshtein))) {
        throw new HttpException(
          'Levenshtein must be a number',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Handle case when levenshtein distance is provided
      if (searchDNA?.levenshtein) {
        const allDNAs = await this.dnaRepository.find({
          order: { DNA: 'ASC' },
        });
        return allDNAs.filter(
          (val) =>
            +searchDNA.levenshtein ===
            Utils.LevenshteinDistance(val.DNA, searchQuery),
        );
      }

      // Return matched DNA records based on search query
      return await this.dnaRepository.find({
        where: { DNA: Like(`${searchQuery}%`) },
        order: { DNA: 'ASC' },
      });
    } catch (err) {
      throw new HttpException(
        err.message || 'Internal Server Error',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createDNA: CreateDNADto): Promise<DNADto> {
    try {
      const DNAValue = createDNA.DNA.toUpperCase();

      // Check if the DNA already exists in the database
      const existingEntity = await this.dnaRepository.findOne({
        where: { DNA: DNAValue },
      });
      if (existingEntity) {
        throw new HttpException(
          `${DNAValue} already exists`,
          HttpStatus.CONFLICT,
        );
      }

      // Save the new DNA record
      return await this.dnaRepository.save({ ...createDNA, DNA: DNAValue });
    } catch (err) {
      throw new HttpException(
        err.message || 'Internal Server Error',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
