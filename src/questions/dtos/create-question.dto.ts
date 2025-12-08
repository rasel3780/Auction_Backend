import { ApiProperty } from "@nestjs/swagger";

export class CreteQuesDto {
    @ApiProperty()
    questionText: string;
    @ApiProperty()
    userId: string;
    @ApiProperty()
    itemId: string;
}
