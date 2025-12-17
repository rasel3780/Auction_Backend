import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AuctionStatus } from '../item.entity'

export class responseItemDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    title: string;

    @ApiProperty()
    @Expose()
    description: string;

    @ApiProperty({ example: 100.0 })
    @Expose()
    basePrice: number;

    @ApiProperty({ example: 150.0 })
    @Expose()
    currentPrice: number;

    @ApiProperty({ example: '2025-12-20T10:00:00.000Z' })
    @Expose()
    startTime: Date;

    @ApiProperty({ example: '2025-12-27T10:00:00.000Z' })
    @Expose()
    endTime: Date;

    @ApiProperty({ enum: AuctionStatus })
    @Expose()
    status: AuctionStatus;

    @ApiProperty({ example: '1c259823-4911-41b1-a142-42dfbd20e8e4', nullable: true })
    @Expose()
    ownerId: string | null;

    @ApiProperty({ example: '1c259823-4911-41b1-a142-42dfbd20e8e4' })
    @Expose()
    sellerId: string;

    @ApiProperty({ example: '/uploads/item_images/...' })
    @Expose()
    primaryImage: string | null;

    @ApiProperty({ example: ['url1.jpg', 'url2.png'] })
    @Expose()
    imageUrls: string[];

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt?: Date | null;


}