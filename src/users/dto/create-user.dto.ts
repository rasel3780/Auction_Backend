import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({example: 'dummy name'})
  @IsString()
  fullname: string;

  @ApiProperty({example: 'dummy@example.com'})
  @IsEmail()
  email: string;

  @ApiProperty({example: 'dummy password'})
  @IsString()
  password: string;
}