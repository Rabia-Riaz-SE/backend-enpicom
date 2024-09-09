import { Module } from '@nestjs/common';
import { DNAController } from './dna.controller';
import { DNAService } from './dna.service';
import { DNA } from './entity/dna.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([DNA])],
    controllers: [DNAController],
    providers: [DNAService]
})
export class DNAModule {}
