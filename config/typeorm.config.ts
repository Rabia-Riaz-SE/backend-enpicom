import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const typeORMConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => typeORMConfig.ORMConfig(configService),
  inject: [ConfigService],
};

export default class typeORMConfig {
  static ORMConfig = (configService): TypeOrmModuleOptions => {
    return {
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: parseInt(configService.get('DB_PORT'), 10),
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASS'),
      database: configService.get('DB_NAME'),
      synchronize: configService.get('DB_SYNC'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    };
  };
}
