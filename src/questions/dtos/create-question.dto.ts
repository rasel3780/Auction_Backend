import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsString } from "class-validator";

export class CreteQuesDto {
    @ApiProperty()
    @IsString()
    questionText: string;

    @ApiProperty()
    @IsUUID()
    itemId: string;
}
