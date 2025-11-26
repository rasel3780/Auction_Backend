import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column, 
} from 'typeorm';
import {v4 as uuidv4} from 'uuid';

export class BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date = new Date();

    @UpdateDateColumn({type: 'timestamp', nullable: true})
    updatedAt: Date;

    @Column({default: false})
    isDeleted: boolean = false;
}