import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { Repository } from 'typeorm';
import { AnswerEntity } from './answer.entity';
import { IAnswersService } from './interfaces/answers-service.interface';

@Injectable()
export class AnswersService
  extends BaseService<AnswerEntity>
  implements IAnswersService {
  constructor(
    @InjectRepository(AnswerEntity)
    repo: Repository<AnswerEntity>,
  ) {
    super(repo);
  }
}
