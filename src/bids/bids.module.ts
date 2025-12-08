import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { BidEntity } from './bid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BidEntity])],
  providers: [BidsService],
  controllers: [BidsController],
  exports: [BidsService],
})
export class BidsModule {}
