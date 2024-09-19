import { IsString, IsNotEmpty, Matches } from 'class-validator';

const dnaRegex = /^[ACTGactg]+$/;

export class CreateDNADto {
  @IsString()
  @IsNotEmpty()
  @Matches(dnaRegex, { message: 'DNA must consist of ACTG letters' })
  DNA: string;
}
