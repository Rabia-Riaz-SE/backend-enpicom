import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateDNADto, DNADto, SearchDNADto } from 'src/dna/dto';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { DNATestData } from './dnaTestData';
import { DNATestDataInterface, ErrorTypeDto } from './testUtils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Use Endpoints with /dna');
  });

  describe('/dna (POST) - Create DNA', () => {
    it('should create a new DNA entry', () => {
      const data: DNATestDataInterface<CreateDNADto, DNADto> =
        DNATestData.createDNADto;

      return request(app.getHttpServer())
        .post('/dna')
        .send(data.query)
        .expect(HttpStatus.CREATED)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              id: expect.any(Number), // Expect id to be a number
              DNA: data.response.DNA, // Verifying the DNA value
            }),
          );
        });
    });

    it('should return a conflict error when trying to create an existing DNA', () => {
      const data: DNATestDataInterface<CreateDNADto, ErrorTypeDto> =
        DNATestData.duplicateDNA;

      return request(app.getHttpServer())
        .post('/dna')
        .send(data.query)
        .expect(HttpStatus.CONFLICT)
        .then((response) => {
          expect(response.body.message).toEqual(data.response.message);
        });
    });

    it('should return a validation error for invalid DNA format', () => {
      const data: DNATestDataInterface<CreateDNADto, ErrorTypeDto> =
        DNATestData.createDNADtoInvalid;

      return request(app.getHttpServer())
        .post('/dna')
        .send(DNATestData.createDNADtoInvalid.query)
        .expect(HttpStatus.BAD_REQUEST)
        .then((response) => {
          expect(response.body.message).toContain(data.response.message[0]);
        });
    });
  });

  describe('/dna (GET) - Search DNA', () => {
    it('should return matching DNAs based on search query', () => {
      const data: DNATestDataInterface<SearchDNADto, DNADto[]> =
        DNATestData.searchDNADto;
      return request(app.getHttpServer())
        .get('/dna')
        .query(data.query)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body.length).toBeGreaterThan(0);
          expect(response.body[0]).toEqual(
            expect.objectContaining({
              id: expect.any(Number), // Expect id to be a number
              DNA: expect.any(String), // Verifying the DNA is a string
            }),
          );
        });
    });

    it('should return a validation error if levenshtein is not a number', () => {
      const data: DNATestDataInterface<SearchDNADto, ErrorTypeDto> =
        DNATestData.searchDNADtoWithInvalidLevenshtein;

      return request(app.getHttpServer())
        .get('/dna')
        .query(data.query)
        .expect(data.response.statusCode as HttpStatus)
        .then((response) => {
          expect(response.body.message).toEqual(data.response.message);
        });
    });

    it('should return an empty result if no matching DNAs are found', () => {
      const data: DNATestDataInterface<SearchDNADto, DNADto[]> =
        DNATestData.searchDNADtoUnMatchedDNA;

      return request(app.getHttpServer())
        .get('/dna')
        .query(data.query)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toEqual(data.response);
        });
    });
  });
});
