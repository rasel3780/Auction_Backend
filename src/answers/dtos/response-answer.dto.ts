import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
export class ResponseAnsDto {
    @ApiProperty()
    @Expose()
    answerText: string;
    @ApiProperty()
    @Expose()
    userId: string;
    @ApiProperty()
    @Expose()
    questionId: string;
}