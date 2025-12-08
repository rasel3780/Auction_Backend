import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class createItemDto {
    @ApiProperty({ example: 'example item name' })
    @IsString()
    title: string;
}