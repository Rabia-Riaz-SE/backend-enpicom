import {IsString, IsNotEmpty, Matches} from 'class-validator';

const dnaRegex = /^[ACTGactg]+$/;

export class CreateDNAdto { 
    @IsString()
    @IsNotEmpty()
    @Matches( (dnaRegex) , { message: "DNA must consist of ACTG letters"} )
    dna: string; 
}