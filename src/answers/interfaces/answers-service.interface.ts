import { IBaseService } from 'src/common/interfaces/base-service.interface';
import { AnswerEntity } from '../answer.entity';

/**
 * Answers service interface extending base CRUD operations
 */
export interface IAnswersService extends IBaseService<AnswerEntity> {
  // Add any answer-specific methods here
}
