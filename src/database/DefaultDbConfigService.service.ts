import { join } from 'path';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.enitity';
import { ConfigService } from '@nestjs/config';
import { Status } from 'src/modules/statuses/entities/status.entity';
@Injectable()
export default class DefaultDbConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbConfig = this.configService.get('database');
    return {
      type: dbConfig.type as any,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.name,
      synchronize: true,
      logging: ['error'],
      migrationsRun: process.env.RUN_MIGRATIONS === 'true',
      entities: [User, Status],
      migrations: [join(__dirname, '/../migrations/*{.ts,.js}')],
    };
  }
}
