import { HttpStatus } from '@nestjs/common';

export default class Utils {
  static LevenshteinDistance = (str1: string, str2: string): number => {
    if (str1.trim() === '') return str2.length;
    if (str2.trim() === '') return str1.length;

    const rows = str1.length + 1;
    const cols = str2.length + 1;
    let arr = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (let i = 0; i <= str1.length; i++) arr[i][0] = i;
    for (let j = 0; j <= str2.length; j++) arr[0][j] = j;

    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        arr[i][j] = Math.min(
          arr[i - 1][j] + 1,
          arr[i][j - 1] + 1,
          arr[i - 1][j - 1] + cost,
        );
      }
    }
    return arr[str1.length][str2.length];
  };
}

export interface DNATestDataInterface<TQuery, TResponse> {
  query: TQuery;
  response: TResponse;
}

export class ErrorTypeDto {
  statusCode: HttpStatus | string;
  message: string[] | string;
  error?: string;
}
