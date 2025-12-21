import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { ItemCategoryEntity } from './ItemCategoryEntity';
import { IItemsCategoryService } from './interfaces/itemCategory.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ItemCategoryService
    extends BaseService<ItemCategoryEntity>
    implements IItemsCategoryService {

    constructor(
        @InjectRepository(ItemCategoryEntity)
        repo: Repository<ItemCategoryEntity>
    ) {
        super(repo);
    }




}
