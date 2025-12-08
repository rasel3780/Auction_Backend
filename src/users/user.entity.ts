import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { ItemEntity } from '../items/item.entity';
import { BidEntity } from '../bids/Bid.entity';
import { QuestionEntity } from '../questions/question.entity';
import { AnswerEntity } from '../answers/answer.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', nullable: true })
  profilePic: string | null;

  @Column()
  address: string;

  @Column()
  phone: string;

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