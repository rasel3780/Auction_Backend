
import { BaseEntity } from "src/common/entities/base.entity";
import { Entity, Column } from "typeorm";


@Entity('item_categories')
export class ItemCategoryEntity extends BaseEntity {
    @Column({ unique: true })
    name: string;
}