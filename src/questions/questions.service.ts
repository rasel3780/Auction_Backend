import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { Repository } from 'typeorm';
import { IQuestionsService } from './interfaces/questions-service.interface';
import { QuestionEntity } from './question.entity';

@Injectable()
export class QuestionsService
  extends BaseService<QuestionEntity>
  implements IQuestionsService {
  constructor(
    @InjectRepository(QuestionEntity)
    repo: Repository<QuestionEntity>,
  ) {
    super(repo);
  }
}
