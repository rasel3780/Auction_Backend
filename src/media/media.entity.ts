import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { ItemEntity } from '../items/item.entity';

export enum MediaType {
    PROFILE_PICTURE = 'profile_picture',
    ITEM_IMAGE = 'item_image',
}

@Entity('media')
export class MediaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @Column({ type: 'enum', enum: MediaType })
    type: MediaType;


    @Column({ nullable: true })
    fileName: string;

    @Column({ type: 'int', nullable: true })
    fileSize: number;

    @Column({ nullable: true })
    mimeType: string;

    @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'CASCADE' })
    user: UserEntity | null;

    @ManyToOne(() => ItemEntity, (item) => item.media, { nullable: true, onDelete: 'CASCADE' })
    item: ItemEntity | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}