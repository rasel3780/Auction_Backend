import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { Repository } from 'typeorm';
import { BidEntity } from '../bids/bid.entity';
import { IBidsService } from './interfaces/bids-service.interface';

@Injectable()
export class BidsService
  extends BaseService<BidEntity>
  implements IBidsService {
  constructor(
    @InjectRepository(BidEntity)
    repo: Repository<BidEntity>,
  ) {
    super(repo);
  }

}
