import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req
} from '@nestjs/common';
import { ApiResponse, ok, fail } from 'src/common/helper/api-response.dto';
import { plainToInstance } from 'class-transformer';
import { QuestionsService } from './questions.service';
import { QuestionEntity } from './question.entity';
import { PaginationQueryDto } from 'src/common/dtos/PaginationQuery.dto';
import { ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ResponseQuesDto } from './dtos/response-question.dto';
import { UpdateQuesDto } from './dtos/update-question.dto';
import { CreteQuesDto } from './dtos/create-question.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private readonly questionService: QuestionsService) { }

  @Post()
  async create(
    @Body() dto: CreteQuesDto,
    @Req() req: any
  ): Promise<ApiResponse<ResponseQuesDto>> {

    const userId = req.user.sub;

    const entity = plainToInstance(QuestionEntity, dto);

    entity.userId = userId;
    const result = await this.questionService.create(entity);

    if (!result.isSuccess) {
      return fail(result.message!, result.code);
    }

    const responseDto = plainToInstance(ResponseQuesDto, result.data, {
      excludeExtraneousValues: true,
    });
    return ok(responseDto, 201);
  }

  @Get()
  async findAll(): Promise<ApiResponse<ResponseQuesDto[]>> {
    const result = await this.questionService.getAll();
    if (!result.isSuccess) {
      return fail(result.message!, result.code);
    }

    const responseDtos = plainToInstance(ResponseQuesDto, result.data || [], {
      excludeExtraneousValues: true,
    });
    return ok(responseDtos);
  }

  @Get('paged')
  async getPaged(
    @Query() query: PaginationQueryDto,
  ): Promise<ApiResponse<{ items: ResponseQuesDto[]; totalCount: number }>> {
    const result = await this.questionService.getPaged(query);
    if (!result.items.isSuccess) {
      return fail(result.items.message!, result.items.code);
    }

    const items = plainToInstance(ResponseQuesDto, result.items.data || [], {
      excludeExtraneousValues: true,
    });

    return ok({ items, totalCount: result.totalCount });
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string): Promise<ApiResponse<ResponseQuesDto>> {
    const result = await this.questionService.getById(id);
    if (!result.isSuccess) {
      return fail(result.message!, result.code);
    }

    const responseDto = plainToInstance(ResponseQuesDto, result.data, {
      excludeExtraneousValues: true,
    });
    return ok(responseDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateQuesDto,
  ): Promise<ApiResponse<ResponseQuesDto>> {

    const entity = plainToInstance(QuestionEntity, dto);
    const result = await this.questionService.update(id, entity);

    if (!result.isSuccess) {
      return fail(result.message!, result.code);
    }

    const responseDto = plainToInstance(ResponseQuesDto, result.data, {
      excludeExtraneousValues: true,
    });
    return ok(responseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<null>> {

    const result = await this.questionService.softDelete(id);
    if (!result.isSuccess) {
      return fail(result.message!, result.code);
    }
    return ok(null, 200);
  }
}