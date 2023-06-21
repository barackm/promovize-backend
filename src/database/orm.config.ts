import { DBConfigService } from './database.service';

export default {
  ...new DBConfigService().createTypeOrmOptions(),
  migrationsTableName: 'migrations',
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};
