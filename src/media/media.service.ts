import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaEntity, MediaType } from './media.entity';

@Injectable()
export class MediaService {
    constructor(
        @InjectRepository(MediaEntity)
        private mediaRepo: Repository<MediaEntity>,
    ) { }

    async createMedia(
        url: string,
        type: MediaType,
        userId: string | null = null,
        itemId: string | null = null,
        fileName?: string,
        fileSize?: number,
        mimeType?: string,
    ) {
        const media = this.mediaRepo.create({
            url,
            type,
            fileName,
            fileSize,
            mimeType,
            user: userId ? { id: userId } as any : null,
            item: itemId ? { id: itemId } as any : null,
        });
        return this.mediaRepo.save(media);
    }

    async deleteMedia(id: string): Promise<void> {
        await this.mediaRepo.delete(id);
    }

    async findProfilePictureByUserId(userId: string) {
        return this.mediaRepo.findOne({
            where: { user: { id: userId }, type: MediaType.PROFILE_PICTURE },
        });
    }

    async findItemPicturesByItemId(itemId: string) {
        return this.mediaRepo.find({
            where: { item: { id: itemId }, type: MediaType.ITEM_IMAGE },
            order: { createdAt: 'ASC' },
        });
    }

    async deleteProfilePictureByUserId(userId: string): Promise<void> {
        const media = await this.findProfilePictureByUserId(userId);
        if (media) {
            await this.mediaRepo.remove(media);
        }
    }
}