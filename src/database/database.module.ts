import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBConfigService } from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DBConfigService,
    }),
  ],
})
export class DatabaseModule {}
