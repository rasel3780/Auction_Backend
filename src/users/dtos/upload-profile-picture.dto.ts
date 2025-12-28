import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadProfilePictureDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Profile picture file (JPEG, PNG, GIF)',
    })
    file: any;
}