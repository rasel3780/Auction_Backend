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
import { BaseEntity } from '../common/entities/base.entity';
import { BidEntity } from '../bids/bid.entity';
import { UserEntity } from '../users/user.entity';
import { QuestionEntity } from '../questions/question.entity';
import { MediaEntity } from 'src/media/media.entity';
import { ItemCategoryEntity } from 'src/item-category/ItemCategoryEntity';

export enum AuctionStatus {
  Upcoming = 'Upcoming',
  Active = 'Active',
  Ended = 'Ended',
}

@Entity('items')
export class ItemEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column('float')
  basePrice: number;

  @Column('float')
  currentPrice: number;

  @Column('timestamptz')
  startTime: Date;

  @Column('timestamptz')
  endTime: Date;

  @Column({
    type: 'enum',
    enum: AuctionStatus,
    default: AuctionStatus.Upcoming,
  })
  status: AuctionStatus;

  @Column({ type: 'uuid', nullable: true })
  ownerId: string | null;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string | null;

  @ManyToOne(() => ItemCategoryEntity, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: ItemCategoryEntity | null;

  @ManyToOne(() => UserEntity, (user) => user.ownedItems, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner: UserEntity | null;

  @Column({ type: 'uuid' })
  sellerId: string;

  @ManyToOne(() => UserEntity, (user) => user.itemsForSale)
  @JoinColumn({ name: 'sellerId' })
  seller: UserEntity;

  @OneToMany(() => BidEntity, (bid) => bid.item)
  bids: BidEntity[];

  @OneToMany(() => QuestionEntity, (q) => q.item)
  questions: QuestionEntity[];

  @OneToMany(() => MediaEntity, (media) => media.item, { cascade: true })
  media: MediaEntity[];
}
