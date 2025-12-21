import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseBidDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    amount: number;

    @ApiProperty()
    @Expose()
    itemId: string;

    @ApiProperty()
    @Expose()
    userId: string;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty({ nullable: true })
    @Expose()
    updatedAt?: Date | null;
}