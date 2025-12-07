import { Expose } from 'class-transformer';
export class UserResponseDto {
  @Expose()
  id: number;
  @Expose()
  fullname: string;
  @Expose()
  email: string;
}
