import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  fullName: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty({ nullable: true })
  @Expose()
  profilePic: string | null;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty({ nullable: true })
  @Expose()
  phone: string | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
