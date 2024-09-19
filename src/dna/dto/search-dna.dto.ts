import { IsString, IsOptional } from 'class-validator';

export class SearchDNADto {
  @IsString()
  @IsOptional()
  DNA?: string = '';

  @IsOptional()
  levenshtein?: string;
}
