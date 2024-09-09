
import {IsString, IsOptional} from 'class-validator';

export class SearchDNAdto {
    @IsString()
    dna: string=""; 
    
    @IsOptional()
    levenshtein?: number
}