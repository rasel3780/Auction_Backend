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
import { UserEntity } from 'src/users/user.entity' 
import { ItemEntity } from 'src/items/item.entity';

@Entity('bids')
export class BidEntity extends BaseEntity {
  @Column('float')
  amount: number;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.bids)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => ItemEntity, (item) => item.bids)
  @JoinColumn({ name: 'itemId' })
  item: ItemEntity;
}