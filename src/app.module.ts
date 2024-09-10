import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DNAModule } from './dna/dna.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeORMConfigAsync} from '../config/typeorm.config'
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeORMConfigAsync),
    DNAModule,
  ],
  controllers : [AppController],
  providers : [AppService],
})

export class AppModule {}