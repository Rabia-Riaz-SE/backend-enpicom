import { CreateDNADto, DNADto, SearchDNADto } from '../src/dna/dto';
import { HttpStatus } from '@nestjs/common';
import { DNATestDataInterface, ErrorTypeDto } from '../src/utils';

const newDNA: string = 'ACCCT';
export class DNATestData {
  public static mockDNAs: DNADto[] = [
    { id: 1, DNA: 'ACTG' },
    { id: 2, DNA: 'ACTC' },
    { id: 3, DNA: 'A' },
    { id: 4, DNA: 'C' },
  ];

  // Dummy data for CreateDNADto
  public static createDNADto: DNATestDataInterface<CreateDNADto, DNADto> = {
    query: { DNA: newDNA },
    response: { id: 1, DNA: newDNA },
  };

  // Dummy data for CreateDNADto negative scenarios
  public static createDNADtoEmpty: DNATestDataInterface<
    CreateDNADto,
    ErrorTypeDto
  > = {
    query: { DNA: '' },
    response: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: ['DNA should not be empty'],
      error: 'Bad Request',
    },
  };

  public static duplicateDNA: DNATestDataInterface<CreateDNADto, ErrorTypeDto> =
    {
      query: DNATestData.createDNADto.query,
      response: {
        message: `${DNATestData.createDNADto.query.DNA} already exists`,
        statusCode: HttpStatus.CONFLICT,
      },
    };

  public static createDNADtoInvalid: DNATestDataInterface<
    CreateDNADto,
    ErrorTypeDto
  > = {
    query: { DNA: 'ss' },
    response: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: ['DNA must consist of ACTG letters'],
      error: 'Bad Request',
    },
  };

  // Dummy data for SearchDNADto positive scenarios
  public static searchDNADto: DNATestDataInterface<SearchDNADto, DNADto[]> = {
    query: { DNA: DNATestData.createDNADto.query.DNA, levenshtein: '1' },
    response: [
      { id: 1, DNA: `${DNATestData.createDNADto.query.DNA}A` },
      { id: 2, DNA: `T${DNATestData.createDNADto.query.DNA}` },
    ],
  };

  // Dummy data for CreateDNADto negative scenarios
  public static searchDNADtoWithInvalidLevenshtein: DNATestDataInterface<
    SearchDNADto,
    ErrorTypeDto
  > = {
    query: { DNA: 'ACTG', levenshtein: 'x' },
    response: {
      message: 'Levenshtein must be a number',
      statusCode: HttpStatus.BAD_REQUEST,
    },
  };

  public static searchDNADtoWithEmptyDNA: DNATestDataInterface<
    SearchDNADto,
    DNADto[]
  > = {
    query: { DNA: '', levenshtein: '1' },
    response: [
      { id: 3, DNA: 'A' },
      { id: 4, DNA: 'C' },
    ],
  };

  public static searchDNADtoWithNoLevenshtein: DNATestDataInterface<
    SearchDNADto,
    DNADto[]
  > = {
    query: { DNA: 'AC' },
    response: [
      { id: 1, DNA: 'ACTG' },
      { id: 2, DNA: 'ACTC' },
    ],
  };

  public static searchDNADtoUnMatchedDNA: DNATestDataInterface<
    SearchDNADto,
    DNADto[]
  > = {
    query: { DNA: 'Fb', levenshtein: '0' },
    response: [],
  };
}
