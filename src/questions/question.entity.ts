import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { BaseEntity } from '../common/entities/base.entity'
import { UserEntity } from 'src/users/user.entity';
import { ItemEntity } from 'src/items/item.entity';
import { AnswerEntity } from 'src/answers/answer.entity';



@Entity('questions')
export class QuestionEntity extends BaseEntity {
  @Column()
  questionText: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.questions)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => ItemEntity, (item) => item.questions)
  @JoinColumn({ name: 'itemId' })
  item: ItemEntity;

  @OneToMany(() => AnswerEntity, (a) => a.question)
  answers: AnswerEntity[];
}
