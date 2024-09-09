import { Controller, Get, Param, Body, Post, Query } from '@nestjs/common';
import {DNAService} from './dna.service';
import {DNAdto, CreateDNAdto} from './dto'

@Controller('dna')
export class DNAController {
    constructor(private readonly DNAService: DNAService) {}

      /**
   * we have used get decorator with search query to get matched DNAs from request
   * so the API URL will be
   * Get http://localhost:3000/dna/dna=searchKey&levenshtein=1
   */
    @Get()
    findAll(@Query("search") search:string , @Query("levenshtein") levenshtein?: number){
      const dna_array=   this.DNAService.findAll({dna:search ?? "", levenshtein: levenshtein || 0});
      return dna_array
    }

       /**
   * we have used Post decorator with Dna as string in an object to insert new DNA to system
   * so the API URL will be
   * Post http://localhost:3000/dna
   */
    @Post()
    create(@Body() createDNA: CreateDNAdto ) {
        const dna  = this.DNAService.create(createDNA);
        return dna;
    }
}

