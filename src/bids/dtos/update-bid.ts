import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBidDto } from './create-bid.dto';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateBidDto {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Min(0.01)
    amount?: number;
}