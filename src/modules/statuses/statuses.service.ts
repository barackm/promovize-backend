import { Injectable } from '@nestjs/common';
import { Status, StatusName } from './entities/status.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StatusesService {
  constructor(
    @InjectRepository(Status) private statusRepository: Repository<Status>,
  ) {}

  async getStatuses() {
    return await this.statusRepository.find();
  }

  async getStatus(id: number) {
    return await this.statusRepository.findOne({
      where: { id },
    });
  }

  async getStatusByLabel(label: StatusName) {
    return await this.statusRepository.findOne({
      where: { label },
    });
  }
}
