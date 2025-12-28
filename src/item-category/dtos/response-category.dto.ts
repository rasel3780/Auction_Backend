import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
export class CategoryResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty({ nullable: true })
    @Expose()
    updatedAt?: Date | null;
}