import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateBidDto {
    @ApiProperty({ example: 'Bid Ammount' })
    amount: number;

    @ApiProperty({ example: 'Item id' })
    itemId: string;

    @ApiProperty({ example: 'Bidder id' })
    userId: string;
}