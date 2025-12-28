import { QuestionEntity } from 'src/questions/question.entity';
import { UserEntity } from 'src/users/user.entity';
import { BaseEntity } from '../common/entities/base.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

@Entity('answers')
export class AnswerEntity extends BaseEntity {
  @Column()
  answerText: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.answers)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'uuid' })
  questionId: string;

  @ManyToOne(() => QuestionEntity, (q) => q.answers)
  @JoinColumn({ name: 'questionId' })
  question: QuestionEntity;
}
