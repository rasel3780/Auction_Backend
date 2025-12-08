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
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiResponse, ok, fail } from 'src/common/helper/api-response.dto';
import { plainToInstance } from 'class-transformer';
import { ItemsService } from './items.service';
import { ItemEntity } from './item.entity';
import { createItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';
import { PaginationQueryDto } from 'src/common/dtos/PaginationQuery.dto';
import { ApiParam } from '@nestjs/swagger';
import { responseItemDto } from './dtos/response-item.dto';

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


  async create(
    @Body() dto: createItemDto,
  ): Promise<ApiResponse<responseItemDto>> {


    const entity = plainToInstance(ItemEntity, dto);
    const result = await this.itemsService.create(entity);

    if (result.isError) {
      return fail(result.message!, result.code);
    }

    const responseDto = plainToInstance(responseItemDto, result.data, {
      excludeExtraneousValues: true,
    });
    return ok(responseDto, 201);
  }

  @Get()
  async findAll(): Promise<ApiResponse<responseItemDto[]>> {
    const result = await this.itemsService.getAll();
    if (result.isError) {
      return fail(result.message!, result.code);
    }

    const responseDtos = plainToInstance(responseItemDto, result.data || [], {
      excludeExtraneousValues: true,
    });
    return ok(responseDtos);
  }

  @Get('paged')
  async getPaged(
    @Query() query: PaginationQueryDto,
  ): Promise<ApiResponse<{ items: responseItemDto[]; totalCount: number }>> {
    const result = await this.itemsService.getPaged(query);
    if (result.items.isError) {
      return fail(result.items.message!, result.items.code);
    }

    const items = plainToInstance(responseItemDto, result.items.data || [], {
      excludeExtraneousValues: true,
    });

    return ok({ items, totalCount: result.totalCount });
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string): Promise<ApiResponse<responseItemDto>> {
    const result = await this.itemsService.getById(id);
    if (result.isError) {
      return fail(result.message!, result.code);
    }

    const responseDto = plainToInstance(responseItemDto, result.data, {
      excludeExtraneousValues: true,
    });
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

    if (result.isError) {
      return fail(result.message!, result.code);
    }

    const responseDto = plainToInstance(responseItemDto, result.data, {
      excludeExtraneousValues: true,
    });
    return ok(responseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<null>> {
    const result = await this.itemsService.softDelete(id);
    if (result.isError) {
      return fail(result.message!, result.code);
    }
    return ok(null, 200);
  }
}