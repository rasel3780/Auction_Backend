import { ApiProperty } from "@nestjs/swagger";

export class CreateAnsDto {
    @ApiProperty()
    answerText: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    questionId: string;
}