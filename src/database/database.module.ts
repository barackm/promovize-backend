import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import DefaultDbConfigService from './DefaultDbConfigService.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DefaultDbConfigService,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
