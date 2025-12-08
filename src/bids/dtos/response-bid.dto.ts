import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseBidDto {
    @ApiProperty()
    @Expose()
    amount: number;

    @ApiProperty()
    @Expose()
    itemId: string;

    @ApiProperty()
    @Expose()
    userId: string;
}