import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from '../items/item.entity';
import { BidEntity } from '../bids/bid.entity';
import { UserEntity } from '../users/user.entity';
import { AuctionService } from './auction.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ItemEntity, BidEntity, UserEntity]),
    ],
    providers: [AuctionService],
    exports: [AuctionService],
})
export class AuctionModule { } 