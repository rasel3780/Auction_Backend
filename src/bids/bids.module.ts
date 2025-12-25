import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { BidEntity } from './bid.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BidEntity]),
    AuthModule
  ],
  providers: [BidsService],
  controllers: [BidsController],
  exports: [BidsService],
})
export class BidsModule { }
