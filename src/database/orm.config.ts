import DefaultDbConfigService from './DefaultDbConfigService.service';

export default {
  ...new DefaultDbConfigService().createTypeOrmOptions(),
  migrationsTableName: 'migrations',
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};
