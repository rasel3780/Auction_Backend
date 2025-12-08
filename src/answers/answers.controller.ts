import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiResponse, ok, fail } from 'src/common/helper/api-response.dto';
import { plainToInstance } from 'class-transformer';
import { AnswersService } from './answers.service';
import { AnswerEntity } from './answer.entity';
import { PaginationQueryDto } from 'src/common/dtos/PaginationQuery.dto';
import { ApiParam } from '@nestjs/swagger';
import { ResponseAnsDto } from './dtos/response-answer.dto';
import { CreateAnsDto } from './dtos/create-answer.dto';
import { UpdateAnsDto } from './dtos/update-answer.dto';

@Controller('api/Answer')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) { }

  @Post()
  async create(
    @Body() dto: CreateAnsDto,
  ): Promise<ApiResponse<ResponseAnsDto>> {
    const entity = plainToInstance(AnswerEntity, dto);
    const result = await this.answersService.create(entity);

    if (result.isError) {
      return fail(result.message!, result.code);
    }

    const responseDto = plainToInstance(ResponseAnsDto, result.data, {
      excludeExtraneousValues: true,
    });
    return ok(responseDto, 201);
  }

  @Get()
  async findAll(): Promise<ApiResponse<ResponseAnsDto[]>> {
    const result = await this.answersService.getAll();
    if (result.isError) {
      return fail(result.message!, result.code);
    }

    const responseDtos = plainToInstance(ResponseAnsDto, result.data || [], {
      excludeExtraneousValues: true,
    });
    return ok(responseDtos);
  }

  @Get('paged')
  async getPaged(
    @Query() query: PaginationQueryDto,
  ): Promise<ApiResponse<{ items: ResponseAnsDto[]; totalCount: number }>> {
    const result = await this.answersService.getPaged(query);
    if (result.items.isError) {
      return fail(result.items.message!, result.items.code);
    }

    const items = plainToInstance(ResponseAnsDto, result.items.data || [], {
      excludeExtraneousValues: true,
    });

    return ok({ items, totalCount: result.totalCount });
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string): Promise<ApiResponse<ResponseAnsDto>> {
    const result = await this.answersService.getById(id);
    if (result.isError) {
      return fail(result.message!, result.code);
    }

    const responseDto = plainToInstance(ResponseAnsDto, result.data, {
      excludeExtraneousValues: true,
    });
    return ok(responseDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAnsDto,
  ): Promise<ApiResponse<ResponseAnsDto>> {
    const entity = plainToInstance(AnswerEntity, dto);
    const result = await this.answersService.update(id, entity);

    if (result.isError) {
      return fail(result.message!, result.code);
    }

    const responseDto = plainToInstance(ResponseAnsDto, result.data, {
      excludeExtraneousValues: true,
    });
    return ok(responseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<null>> {
    const result = await this.answersService.softDelete(id);
    if (result.isError) {
      return fail(result.message!, result.code);
    }
    return ok(null, 200);
  }
}