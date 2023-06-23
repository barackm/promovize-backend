import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import DefaultDbConfigService from './DefaultDbConfigService.service';

const defaultDbConfigService = new DefaultDbConfigService(new ConfigService());

const ormConfig = {
  ...(defaultDbConfigService.createTypeOrmOptions() as TypeOrmModuleOptions),
  migrationsTableName: 'migrations',
  migrations: ['src/database/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};

export default ormConfig;
