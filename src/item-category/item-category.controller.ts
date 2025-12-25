import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { PaginationQueryDto } from 'src/common/dtos/PaginationQuery.dto';
import { ApiResponse, fail, ok } from '../common/helper/api-response.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryResponseDto } from './dtos/response-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { ItemCategoryService } from './item-category.service';
import { ItemCategoryEntity } from './ItemCategoryEntity';



@Controller('api/item-category')
export class ItemCategoryController {
    constructor(private readonly itemCategeoryService: ItemCategoryService) { }

    @Post()
    async create(
        @Body() dto: CreateCategoryDto,
    ): Promise<ApiResponse<CategoryResponseDto>> {
        const entity = plainToInstance(ItemCategoryEntity, dto)

        const result = await this.itemCategeoryService.create(entity);

        if (!result.isSuccess) {
            return fail(result.message!, result.code);
        }

        const responseDto = plainToInstance(CategoryResponseDto, result.data, {
            excludeExtraneousValues: true,
        });

        return ok(responseDto, 201);
    }

    @Get()
    async findAll(): Promise<ApiResponse<CategoryResponseDto[]>> {
        const result = await this.itemCategeoryService.getAll();
        if (!result.isSuccess) {
            return fail(result.message!, result.code);
        }

        const responseDtos = plainToInstance(CategoryResponseDto, result.data || [], {
            excludeExtraneousValues: true,
        });
        return ok(responseDtos);
    }

    @Get('paged')
    async getPaged(
        @Query() query: PaginationQueryDto,
    ): Promise<ApiResponse<{ items: CategoryResponseDto[]; totalCount: number }>> {
        const result = await this.itemCategeoryService.getPaged(query);
        if (!result.items.isSuccess) {
            return fail(result.items.message!, result.items.code);
        }

        const items = plainToInstance(CategoryResponseDto, result.items.data || [], {
            excludeExtraneousValues: true,
        });

        return ok({ items, totalCount: result.totalCount });
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: String })
    async findOne(@Param('id') id: string): Promise<ApiResponse<CategoryResponseDto>> {
        const result = await this.itemCategeoryService.getById(id);
        if (!result.isSuccess) {
            return fail(result.message!, result.code);
        }

        const responseDto = plainToInstance(CategoryResponseDto, result.data, {
            excludeExtraneousValues: true,
        });
        return ok(responseDto);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateCategoryDto,
    ): Promise<ApiResponse<CategoryResponseDto>> {

        const result = await this.itemCategeoryService.update(id, dto);

        if (!result.isSuccess) {
            return fail(result.message!, result.code);
        }

        const responseDto = plainToInstance(CategoryResponseDto, result.data, {
            excludeExtraneousValues: true,
        });
        return ok(responseDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<ApiResponse<null>> {

        const result = await this.itemCategeoryService.softDelete(id);
        if (!result.isSuccess) {
            return fail(result.message!, result.code);
        }
        return ok(null, 200);
    }
}
