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
  public static searchDNADto: SearchDNADto = { DNA: 'ACTG', levenshtein: '1' };
  public static searchDNADtoRes: DNADto[] = [
    { id: 1, DNA: 'ACTG' },
    { id: 2, DNA: 'ACTC' },
  ];

  public static duplicateDNARes = { 
    message: 'ACTG already exists',
    HttpStatus: HttpStatus.CONFLICT
  };

  public static createDNADtoLeveNAN: SearchDNADto ={ DNA: 'ACTG', levenshtein: "x" };
  public static LeveNaNRes = { 
    message: 'levenshtein must be a number',  
    HttpStatus: HttpStatus.BAD_REQUEST
  }

  public static createEmptyDNADto: SearchDNADto ={ DNA: '', levenshtein: '1' };
  public static LeveEmptyRes = { 
    message: 'levenshtein must be a number',  
    HttpStatus: HttpStatus.BAD_REQUEST
  }

}
