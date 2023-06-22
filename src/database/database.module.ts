import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import DefaultDbConfigService from './DefaultDbConfigService.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DefaultDbConfigService,
    }),
  ],
})
export class DatabaseModule {}
