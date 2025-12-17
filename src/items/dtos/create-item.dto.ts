import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { AuctionStatus } from '../item.entity';

export class createItemDto {
    @ApiProperty({ example: 'Vintage Watch' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'A rare 1960s Swiss mechanical watch.' })
    @IsString()
    description: string;

    @ApiProperty({ example: 100.0 })
    @IsNumber()
    @Min(0)
    basePrice: number;

    @ApiProperty({ example: 100.0 })
    @IsNumber()
    @Min(0)
    currentPrice: number;

    @ApiProperty({ example: '2025-12-20T10:00:00Z' })
    @IsDate()
    @Type(() => Date)
    startTime: Date;

    @ApiProperty({ example: '2025-12-27T10:00:00Z' })
    @IsDate()
    @Type(() => Date)
    endTime: Date;

    @ApiProperty({
        enum: AuctionStatus,
        example: AuctionStatus.Upcoming,
        default: AuctionStatus.Upcoming,
        required: false,
    })
    @IsOptional()
    @IsEnum(AuctionStatus)
    status?: AuctionStatus;

    @ApiProperty({ example: '1c259823-4911-41b1-a142-42dfbd20e8e4' })
    @IsString()
    sellerId: string;
}