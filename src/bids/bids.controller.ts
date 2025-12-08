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
import { BidsService } from './bids.service';
import { BidEntity } from './bid.entity';
import { CreateBidDto } from './dtos/create-bid.dto';
import { PaginationQueryDto } from 'src/common/dtos/PaginationQuery.dto';
import { ApiParam } from '@nestjs/swagger';
import { ResponseBidDto } from './dtos/response-bid.dto';
import { UpdateBidDto } from './dtos/update-bid';

@Controller('api/bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) { }

  @Post()
  async create(
    @Body() dto: CreateBidDto,
  ): Promise<ApiResponse<ResponseBidDto>> {
    const entity = plainToInstance(BidEntity, dto);
    const result = await this.bidsService.create(entity);

    if (result.isError) {
      return fail(result.message!, result.code);
    }

    const responseDto = plainToInstance(ResponseBidDto, result.data, {
      excludeExtraneousValues: true,
    });
    return ok(responseDto, 201);
  }

  @Get()
  async findAll(): Promise<ApiResponse<ResponseBidDto[]>> {
    const result = await this.bidsService.getAll();
    if (result.isError) {
      return fail(result.message!, result.code);
    }

    const responseDtos = plainToInstance(ResponseBidDto, result.data || [], {
      excludeExtraneousValues: true,
    });
    return ok(responseDtos);
  }

  @Get('paged')
  async getPaged(
    @Query() query: PaginationQueryDto,
  ): Promise<ApiResponse<{ items: ResponseBidDto[]; totalCount: number }>> {
    const result = await this.bidsService.getPaged(query);
    if (result.items.isError) {
      return fail(result.items.message!, result.items.code);
    }

    const items = plainToInstance(ResponseBidDto, result.items.data || [], {
      excludeExtraneousValues: true,
    });

    return ok({ items, totalCount: result.totalCount });
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string): Promise<ApiResponse<ResponseBidDto>> {
    const result = await this.bidsService.getById(id);
    if (result.isError) {
      return fail(result.message!, result.code);
    }

    const responseDto = plainToInstance(ResponseBidDto, result.data, {
      excludeExtraneousValues: true,
    });
    return ok(responseDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBidDto,
  ): Promise<ApiResponse<ResponseBidDto>> {
    const entity = plainToInstance(BidEntity, dto);
    const result = await this.bidsService.update(id, entity);

    if (result.isError) {
      return fail(result.message!, result.code);
    }

    const responseDto = plainToInstance(ResponseBidDto, result.data, {
      excludeExtraneousValues: true,
    });
    return ok(responseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<null>> {
    const result = await this.bidsService.softDelete(id);
    if (result.isError) {
      return fail(result.message!, result.code);
    }
    return ok(null, 200);
  }
}