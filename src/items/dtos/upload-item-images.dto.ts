import { ApiProperty } from '@nestjs/swagger';

export class UploadItemImagesDto {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
            format: 'binary',
        },
        description: 'Multiple image files (JPEG, PNG, GIF)',
    })
    files: any[];
}