import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { Repository } from 'typeorm';
import { IItemsService } from './interfaces/items-service.interface';
import { ItemEntity } from './item.entity';
import * as fs from 'fs';
import * as path from 'path';
import { MediaService } from 'src/media/media.service';
import { MediaType } from 'src/media/media.entity';
import { BadRequestException } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/PaginationQuery.dto';


@Injectable()
export class ItemsService
  extends BaseService<ItemEntity>
  implements IItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    repo: Repository<ItemEntity>,
    private mediaService: MediaService,

  ) {
    super(repo);
  }

  async getById(id: string) {
    try {
      const item = await this.repo.findOne({
        where: { id, isDeleted: false },
        relations: ['media', 'category'],
      });

      if (!item) {
        return {
          isSuccess: false,
          code: 404,
          message: 'Item not found',
          data: undefined,
        };
      }

      return {
        isSuccess: true,
        code: 200,
        data: item,

      };
    } catch (error) {
      return {
        isSuccess: false,
        code: 500,
        message: error.message,
        data: undefined,
      };
    }
  }


  async getAll() {
    try {
      const items = await this.repo.find({
        where: { isDeleted: false },
        relations: ['media', 'category'],
        order: { createdAt: 'DESC' },
      });

      return {
        isSuccess: true,
        code: 200,
        data: items,
      };
    } catch (error) {
      return {
        isSuccess: false,
        code: 500,
        message: error.message,
        data: undefined,
      };
    }
  }


  async getPaged(query: PaginationQueryDto) {
    try {
      const { pageNumber, pageSize } = query;
      const skip = (pageNumber - 1) * pageSize;

      const [data, totalCount] = await this.repo.findAndCount({
        where: { isDeleted: false },
        relations: ['media', 'category'],
        skip,
        take: pageSize,
        order: { createdAt: 'DESC' },
      });

      return {
        items: {
          isSuccess: true,
          code: 200,
          data,
        },
        totalCount,
      };
    } catch (error) {
      return {
        items: {
          isSuccess: false,
          code: 500,
          message: error.message,
          data: undefined,
        },
        totalCount: 0,
      };
    }
  }
  async uploadItemImages(
    itemId: string,
    files: Express.Multer.File[],
  ): Promise<string[]> {
    if (!files?.length) {
      throw new BadRequestException('No files uploaded');
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    const uploadsDir = path.join(process.cwd(), 'uploads', 'item_images');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Validate user/item exists
    const item = await this.repo.findOne({ where: { id: itemId, isDeleted: false } });
    if (!item) {
      throw new BadRequestException('Item not found');
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!allowedMimes.includes(file.mimetype)) {
        throw new BadRequestException(`Invalid file type: ${file.originalname}`);
      }

      const ext = path.extname(file.originalname).toLowerCase();
      const fileName = `${itemId}_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, file.buffer);

      const url = `/uploads/item_images/${fileName}`;
      urls.push(url);

      // Save media record
      await this.mediaService.createMedia(
        url,
        MediaType.ITEM_IMAGE,
        null,
        itemId,
        file.originalname,
        file.size,
        file.mimetype,
      );
    }

    return urls;
  }
}
