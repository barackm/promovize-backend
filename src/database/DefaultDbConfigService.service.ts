import { join } from 'path';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.enitity';

@Injectable()
export default class DefaultDbConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(<string>process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true, // Set to false in production
      logging: true, // Set to false in production
      migrationsRun: process.env.RUN_MIGRATIONS === 'true',
      entities: [User],
      migrations: [join(__dirname, '/../migrations/*{.ts,.js}')],
    };
  }
}
