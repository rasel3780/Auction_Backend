import { ApiProperty, PartialType } from '@nestjs/swagger';
import { createItemDto } from './create-item.dto';
import { IsOptional, IsString, IsNumber, Min, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { AuctionStatus } from '../item.entity';

export class UpdateItemDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Min(0)
    basePrice?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Min(0)
    currentPrice?: number;

    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startTime?: Date;

    @ApiProperty()
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endTime?: Date;

    @ApiProperty()
    @IsOptional()
    status?: AuctionStatus;
}