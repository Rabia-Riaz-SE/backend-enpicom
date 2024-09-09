import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { DNAdto, CreateDNAdto, SearchDNAdto } from './dto';
import { DNA } from './entity/dna.entity';
import Utils from '../utils'

@Injectable()
export class DNAService {
    constructor( @InjectRepository(DNA) private readonly dnaRepository: Repository<DNA>) { }

    async findAll(searchDNA: SearchDNAdto): Promise<DNAdto[]> {
        try {
            // Validate levenshtein distance is a number 
            if (isNaN(searchDNA.levenshtein))
                throw new HttpException('levenshtein must be a number', HttpStatus.BAD_REQUEST);

             // Validate search is not empty 
            if (searchDNA.levenshtein && searchDNA.dna.length < 1)
                throw new HttpException('Search must not be empty', HttpStatus.BAD_REQUEST);
            
            // Find and calculate levenshtein distance between search parameter and DB existing DNAs 
            if (searchDNA.levenshtein && searchDNA.dna.length > 0) {
                const allDNAs = await this.dnaRepository.find();
                return allDNAs.filter(val => +searchDNA.levenshtein === Utils.LevenshteinDistance(val.dna, searchDNA.dna.toUpperCase()));
            }

            // if levenshtein distance not provided return only searched DNAs
            return await this.dnaRepository.find({
                where: { dna: Like(`${searchDNA.dna.toUpperCase()}%`) },
            });
        }
        catch (err) {
            throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async create(createDNA: CreateDNAdto): Promise<DNAdto> {
        try {

            const DNAValue = createDNA.dna.toUpperCase();
            const entity = await this.dnaRepository.findOne({
                where: { dna: DNAValue }
              });
            if (entity)
                throw new HttpException(`${DNAValue} already exists `, HttpStatus.CONFLICT);
            return await this.dnaRepository.save({...createDNA, dna: DNAValue});
        }
        catch (err) {
            throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
