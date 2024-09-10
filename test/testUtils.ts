import { HttpStatus } from '@nestjs/common';

export interface DNATestDataInterface<TQuery, TResponse> {
    query: TQuery;
    response: TResponse;
  }
  
  export class ErrorTypeDto {
    statusCode: HttpStatus | string;
    message: string[] | string;
    error?: string;
  }
