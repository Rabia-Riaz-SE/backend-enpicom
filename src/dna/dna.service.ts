import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { DNADto, CreateDNADto, SearchDNADto } from './dto';
import { DNA } from './entity/dna.entity';
import Utils from '../utils'

@Injectable()
export class DNAService {
    constructor(@InjectRepository(DNA) private readonly dnaRepository: Repository<DNA>) { }

    async find(searchDNA: SearchDNADto): Promise<DNADto[]> {
        try {
            searchDNA.DNA = searchDNA?.DNA.toUpperCase() ?? '';

            // Validate levenshtein distance is a number 
            if (searchDNA?.levenshtein && isNaN(+(searchDNA?.levenshtein)))
                throw new HttpException('levenshtein must be a number', HttpStatus.BAD_REQUEST);

            // Find and calculate levenshtein distance between search parameter and DB existing DNAs 
            if (searchDNA.levenshtein) {
                const allDNAs = await this.dnaRepository.find();
                return allDNAs.filter(val => +searchDNA.levenshtein === Utils.LevenshteinDistance(val.DNA, searchDNA.DNA));
            }

            // if levenshtein distance not provided return only searched DNAs
            return await this.dnaRepository.find({
                where: { DNA: Like(`${searchDNA.DNA}%`) },
            });
        }
        catch (err) {
            throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async create(createDNA: CreateDNADto): Promise<DNADto> {
        try {

            const DNAValue = createDNA.DNA.toUpperCase();
            const entity = await this.dnaRepository.findOne({
                where: { DNA: DNAValue }
            });
            if (entity)
                throw new HttpException(`${DNAValue} already exists `, HttpStatus.CONFLICT);
            return await this.dnaRepository.save({ ...createDNA, DNA: DNAValue });
        }
        catch (err) {
            throw new HttpException(err.message || 'Internal Server Error', err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
