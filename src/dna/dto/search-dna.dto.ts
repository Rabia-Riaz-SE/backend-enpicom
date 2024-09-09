
import {IsString, IsOptional} from 'class-validator';

export class SearchDNADto {
    @IsString()
    DNA: string=""; 
    
    @IsOptional()
    levenshtein?: number
}