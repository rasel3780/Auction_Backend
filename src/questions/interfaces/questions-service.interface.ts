import { IBaseService } from 'src/common/interfaces/base-service.interface';
import { QuestionEntity } from '../question.entity';

/**
 * Questions service interface extending base CRUD operations
 */
export interface IQuestionsService extends IBaseService<QuestionEntity> {
  // Add any question-specific methods here
}
