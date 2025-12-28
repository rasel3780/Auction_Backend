import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { Repository } from 'typeorm';
import { BidEntity } from '../bids/bid.entity';
import { IBidsService } from './interfaces/bids-service.interface';
import { ItemsService } from 'src/items/items.service';
import { ServiceResult } from 'src/common/interfaces/base-service.interface';

@Injectable()
export class BidsService
  extends BaseService<BidEntity>
  implements IBidsService {
  constructor(
    @InjectRepository(BidEntity)
    repo: Repository<BidEntity>,
    private readonly itemsService: ItemsService,
  ) {
    super(repo);
  }

  async findByItemId(itemId: string): Promise<BidEntity[]> {
    return this.repo.find({
      where: { itemId, isDeleted: false },
      relations: ['user'],
      order: { amount: 'DESC', createdAt: 'DESC' }
    });
  }

  async create(entity: BidEntity): Promise<ServiceResult<BidEntity>> {
    try {
      const itemResult = await this.itemsService.getById(entity.itemId);

      if (!itemResult.isSuccess) {
        return { isSuccess: false, code: 404, message: 'Item not found' };
      }

      const item = itemResult.data;

      if (item!.status !== 'Active') {
        return { isSuccess: false, code: 400, message: 'Can only bid on active auctions' };
      }

      if (entity.amount <= item!.currentPrice) {
        return { isSuccess: false, code: 400, message: 'Bid must be higher than current price' };
      }

      const bid = this.repo.create(entity);
      const savedBid = await this.repo.save(bid);

      const updateResult = await this.itemsService.update(item!.id, {
        currentPrice: entity.amount
      });

      if (!updateResult.isSuccess) {
        await this.repo.delete(savedBid.id);
        return { isSuccess: false, code: 500, message: 'Failed to update item price' };
      }

      return { isSuccess: true, data: savedBid, code: 201 };
    } catch (error) {
      return { isSuccess: false, code: 500, message: error.message };
    }
  }

}
