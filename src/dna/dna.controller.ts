import { Controller, Get, Body, Post, Query } from '@nestjs/common';
import { DNAService } from './dna.service';
import { CreateDNADto } from './dto';

@Controller('dna')
export class DNAController {
  constructor(private readonly DNAService: DNAService) {}

  /**
   * we have used get decorator with search query to get matched DNAs from request
   * so the API URL will be
   * Get http://localhost:3000/dna/dna=searchKey&levenshtein=1
   */
  @Get()
  find(
    @Query('search') search: string,
    @Query('levenshtein') levenshtein?: string,
  ) {
    const result = this.DNAService.find({
      DNA: search,
      levenshtein: levenshtein,
    });
    return result;
  }

  /**
   * we have used Post decorator with Dna as string in an object to insert new DNA to system
   * so the API URL will be
   * Post http://localhost:3000/dna
   */
  @Post()
  create(@Body() createDNA: CreateDNADto) {
    const result = this.DNAService.create(createDNA);
    return result;
  }
}
