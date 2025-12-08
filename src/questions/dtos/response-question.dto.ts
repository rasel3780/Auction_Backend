
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class ResponseQuesDto {
    @ApiProperty()
    @Expose()
    questionText: string;
    @ApiProperty()
    @Expose()
    userId: string;
    @ApiProperty()
    @Expose()
    itemId: string;
}