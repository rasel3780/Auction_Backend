import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { Repository } from 'typeorm';
import { IItemsService } from './interfaces/items-service.interface';
import { ItemEntity } from './item.entity';

@Injectable()
export class ItemsService
  extends BaseService<ItemEntity>
  implements IItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    repo: Repository<ItemEntity>,
  ) {
    super(repo);
  }
}
