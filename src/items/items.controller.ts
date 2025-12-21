import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { plainToInstance } from 'class-transformer';
import { ItemEntity } from './item.entity';
import { createItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { PaginationQueryDto } from 'src/common/dtos/PaginationQuery.dto';
import { responseItemDto } from './dtos/response-item.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ItemsService } from './items.service';
import { ApiResponse, ok, fail } from '../common/helper/api-response.dto';
import { ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { UploadItemImagesDto } from './dtos/upload-item-images.dto';
import { CategoryResponseDto } from 'src/item-category/dtos/response-category.dto';

const storage = diskStorage({
  destination: './uploads/items',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `item-${uniqueSuffix}${ext}`);
  },
});

@Controller('api/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @Post()
  async create(
    @Body() dto: createItemDto,
  ): Promise<ApiResponse<responseItemDto>> {
    const entity = plainToInstance(ItemEntity, dto);
    entity.ownerId = null;
    const result = await this.itemsService.create(entity);

    if (!result.isSuccess) {
      return fail(result.message!, result.code);
    }

    const item = result.data;
    const category = item!.category
      ? plainToInstance(CategoryResponseDto, item!.category, { excludeExtraneousValues: true })
      : null;

    const responseDto: responseItemDto = {
      id: item!.id,
      title: item!.title,
      description: item!.description,
      basePrice: item!.basePrice,
      currentPrice: item!.currentPrice,
      startTime: item!.startTime,
      endTime: item!.endTime,
      status: item!.status,
      ownerId: item!.ownerId,
      sellerId: item!.sellerId,
      categoryId: item!.categoryId,
      category,
      primaryImage: null,
      imageUrls: [],
      createdAt: item!.createdAt,
      updatedAt: item!.updatedAt
    };

    return ok(responseDto, 201);
  }

  @Get()
  async findAll(): Promise<ApiResponse<responseItemDto[]>> {
    const result = await this.itemsService.getAll();
    if (!result.isSuccess) {
      return fail(result.message!, result.code);
    }

    const responseDtos = result.data!.map(item => {
      const media = item.media || [];
      const imageUrls = media.map(m => m.url);
      const primaryImage = imageUrls[0] || null;

      const category = item.category
        ? plainToInstance(CategoryResponseDto, item.category, { excludeExtraneousValues: true })
        : null;

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        basePrice: item.basePrice,
        currentPrice: item.currentPrice,
        startTime: item.startTime,
        endTime: item.endTime,
        status: item.status,
        ownerId: item.ownerId,
        sellerId: item.sellerId,
        categoryId: item.categoryId,
        category,
        primaryImage,
        imageUrls,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt ?? item.createdAt,
      } as responseItemDto;
    });
    return ok(responseDtos);
  }

  @Get('paged')
  async getPaged(
    @Query() query: PaginationQueryDto,
  ): Promise<ApiResponse<{ items: responseItemDto[]; totalCount: number }>> {
    const result = await this.itemsService.getPaged(query);
    if (!result.items.isSuccess) {
      return fail(result.items.message!, result.items.code);
    }

    const responseDtos = result.items.data!.map(item => {
      const media = item.media || [];
      const imageUrls = media.map(m => m.url);
      const primaryImage = imageUrls[0] || null;


      const category = item.category
        ? plainToInstance(CategoryResponseDto, item.category, { excludeExtraneousValues: true })
        : null;

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        basePrice: item.basePrice,
        currentPrice: item.currentPrice,
        startTime: item.startTime,
        endTime: item.endTime,
        status: item.status,
        ownerId: item.ownerId,
        sellerId: item.sellerId,
        categoryId: item.categoryId,
        category,
        primaryImage,
        imageUrls,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt ?? item.createdAt,
      } as responseItemDto;
    });

    return ok({
      items: responseDtos,
      totalCount: result.totalCount,
    });
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string): Promise<ApiResponse<responseItemDto>> {
    const result = await this.itemsService.getById(id);
    if (!result.isSuccess) {
      return fail(result.message!, result.code);
    }

    const item = result.data;
    const media = item?.media || [];
    const imageUrls = media.map(m => m.url);
    const primaryImage = imageUrls[0] || null;

    const category = item?.category
      ? plainToInstance(CategoryResponseDto, item.category, { excludeExtraneousValues: true })
      : null;

    const responseDto: responseItemDto = {
      id: item!.id,
      title: item!.title,
      description: item!.description,
      basePrice: item!.basePrice,
      currentPrice: item!.currentPrice,
      startTime: item!.startTime,
      endTime: item!.endTime,
      status: item!.status,
      ownerId: item!.ownerId,
      sellerId: item!.sellerId,
      categoryId: item!.categoryId,
      category,
      primaryImage,
      imageUrls,
      createdAt: item!.createdAt,
      updatedAt: item?.updatedAt ?? item!.createdAt,
    };

    return ok(responseDto);
  }


  @Put(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage,
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
  ): Promise<ApiResponse<responseItemDto>> {
    const entity = plainToInstance(ItemEntity, dto);
    const result = await this.itemsService.update(id, entity);

    if (!result.isSuccess) {
      return fail(result.message!, result.code);
    }

    // Map updated item with category
    const item = result.data;
    const media = item!.media || [];
    const imageUrls = media.map(m => m.url);
    const primaryImage = imageUrls[0] || null;

    const category = item!.category
      ? plainToInstance(CategoryResponseDto, item!.category, { excludeExtraneousValues: true })
      : null;

    const responseDto: responseItemDto = {
      id: item!.id,
      title: item!.title,
      description: item!.description,
      basePrice: item!.basePrice,
      currentPrice: item!.currentPrice,
      startTime: item!.startTime,
      endTime: item!.endTime,
      status: item!.status,
      ownerId: item!.ownerId,
      sellerId: item!.sellerId,
      categoryId: item!.categoryId,
      category,
      primaryImage,
      imageUrls,
      createdAt: item!.createdAt,
      updatedAt: item!.updatedAt,
    };

    return ok(responseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<null>> {
    const result = await this.itemsService.softDelete(id);
    if (!result.isSuccess) {
      return fail(result.message!, result.code);
    }
    return ok(null, 200);
  }

  @Post(':id/images')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      // Max 10 files
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files (JPEG, PNG, GIF) are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: String, description: 'Item ID' })
  @ApiBody({ type: UploadItemImagesDto })
  async uploadItemImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ApiResponse<string[]>> {
    try {
      if (!files?.length) {
        return fail('No files uploaded', 400);
      }
      const urls = await this.itemsService.uploadItemImages(id, files);
      return ok(urls);
    } catch (error) {
      console.error('Item image upload error:', error);
      if (error instanceof BadRequestException) {
        return fail(error.message, 400);
      }
      return fail('Upload failed', 500);
    }
  }
}