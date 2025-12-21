import { ApiProperty } from "@nestjs/swagger";

import { IsString, MinLength, IsEmail } from "class-validator";

export class ResetPasswordDto {

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    newPassword: string;
}