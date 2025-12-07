import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'dummy name' })
  @IsString()
  fullname: string;

  @ApiProperty({ example: 'dummy@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'dummy password' })
  @MinLength(8)
  @IsString()
  password: string;

  @ApiProperty({ example: 'dummy address' })
  @IsString()
  address: string;
}
