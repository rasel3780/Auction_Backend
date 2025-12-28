import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString, MinLength, Min, IsUUID } from 'class-validator';

export class CreateBidDto {
    @ApiProperty({ example: 'Bid Ammount' })
    @IsNumber()
    @Min(0.01)
    amount: number;

    @ApiProperty({ example: 'Item id' })
    @IsUUID()
    itemId: string;
}