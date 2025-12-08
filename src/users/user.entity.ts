import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { AnswerEntity } from '../answers/answer.entity';
import { BidEntity } from '../bids/bid.entity';
import { BaseEntity } from '../common/entities/base.entity';
import { ItemEntity } from '../items/item.entity';
import { QuestionEntity } from '../questions/question.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @OneToMany(() => ItemEntity, (item) => item.owner)
  ownedItems: ItemEntity[];

  @OneToMany(() => ItemEntity, (item) => item.seller)
  itemsForSale: ItemEntity[];

  @OneToMany(() => BidEntity, (bid) => bid.user)
  bids: BidEntity[];

  @OneToMany(() => QuestionEntity, (q) => q.user)
  questions: QuestionEntity[];

  @OneToMany(() => AnswerEntity, (a) => a.user)
  answers: AnswerEntity[];
}
