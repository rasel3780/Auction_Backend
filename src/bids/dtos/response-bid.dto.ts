import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserEntity } from 'src/users/user.entity';

class UserDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    fullName: string;

    @ApiProperty()
    @Expose()
    email: string;
}


export class ResponseBidDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    amount: number;

    @ApiProperty()
    @Expose()
    itemId: string;

    @ApiProperty()
    @Expose()
    userId: string;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty({ nullable: true })
    @Expose()
    updatedAt?: Date | null;

    @ApiProperty({ type: () => UserDto })
    @Expose()
    @Type(() => UserDto)
    user: UserDto;
}