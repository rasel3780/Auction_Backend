import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreteQuesDto } from './create-question.dto';
import { IsString, IsOptional } from 'class-validator';
export class UpdateQuesDto {

    @ApiProperty()
    @IsString()
    @IsOptional()
    questionText: string
}
