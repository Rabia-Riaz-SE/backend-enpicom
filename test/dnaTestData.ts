import { CreateDNADto, DNADto, SearchDNADto } from '../src/dna/dto';

export class DNAControllerTestData {
  // Dummy data for CreateDNADto
  public static createDNADto: CreateDNADto = { DNA: 'ACTG' };
  public static createDNADto_res: DNADto = { id: 1, DNA: 'ACTG' };

  // Dummy data for CreateDNADto negative scenarios
  public static createDNADtoEmpty: CreateDNADto = { DNA: '' };
  public static createDNADtoInvalid: CreateDNADto = { DNA: 'ss' };

  // Expected error responses for negative scenarios
  public static createDNADtoEmptyRes = {
    statusCode: 400,
    message: ["DNA should not be empty"],
    error: "Bad Request",
  };

  public static createDNADtoInvalidRes = {
    statusCode: 400,
    message: ["DNA must consist of ACTG letters"],
    error: "Bad Request",
  };

  // Dummy data for SearchDNADto positive scenarios
  public static searchDNADto: SearchDNADto = { DNA: 'ACTG', levenshtein: 1 };
  public static searchDNADto_res: DNADto[] = [
    { id: 1, DNA: 'ACTG' },
    { id: 2, DNA: 'ACTC' },
  ];
}
