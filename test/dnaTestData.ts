import { CreateDNADto, DNADto, SearchDNADto } from '../src/dna/dto';
import {  HttpStatus } from '@nestjs/common';

export class DNATestData {
  // Dummy data for CreateDNADto
  public static createDNADto: CreateDNADto = { DNA: 'ACTG' };
  public static createDNADtoRes: DNADto = { id: 1, DNA: 'ACTG' };

  // Dummy data for CreateDNADto negative scenarios
  public static createDNADtoEmpty: CreateDNADto = { DNA: '' };
  public static createDNADtoInvalid: CreateDNADto = { DNA: 'ss' };

  // Expected error responses for negative scenarios
  public static createDNADtoEmptyRes = {
    statusCode: HttpStatus.BAD_REQUEST,
    message: ["DNA should not be empty"],
    error: "Bad Request",
  };

  public static createDNADtoInvalidRes = {
    statusCode: HttpStatus.BAD_REQUEST,
    message: ["DNA must consist of ACTG letters"],
    error: "Bad Request",
  };

  // Dummy data for SearchDNADto positive scenarios
  public static searchDNADto: SearchDNADto = { DNA: 'ACT', levenshtein: '1' };
  public static searchDNADtoRes: DNADto[] = [
    { id: 1, DNA: 'ACTG' },
    { id: 2, DNA: 'ACTC' },
  ];

  public static duplicateDNARes = { 
    message: 'ACTG already exists',
    HttpStatus: HttpStatus.CONFLICT
  };

  public static searchDNADtoLevenshteinNaN: SearchDNADto ={ DNA: 'ACTG', levenshtein: "x" };
  public static searchDNADtoLevenshteinNaNRes = { 
    message: 'Levenshtein must be a number',  
    HttpStatus: HttpStatus.BAD_REQUEST
  }


  public static SearchDNADtoEmptyDNA = { DNA: '', levenshtein: '1' };
  public static mockDNAs: DNADto[] = [
    { id: 1, DNA: 'ACTG' },
    { id: 2, DNA: 'ACTC' },
    { id: 3, DNA: 'A' },
    { id: 4, DNA: 'C' },
  ];
  public static SearchDNADtoEmptyDNARes: DNADto[] = [ { id: 3, DNA: 'A' }, { id: 4, DNA: 'C' }]
  public static SearchDNADtoWithoutLevenshtein: SearchDNADto = { DNA: 'AC' }
  public static SearchDNADtoWithoutLevenshteinRes: DNADto[] = [   
    { id: 1, DNA: 'ACTG' },
    { id: 2, DNA: 'ACTC' }
  ];


}
