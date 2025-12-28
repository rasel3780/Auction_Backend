import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { PaginationQueryDto } from 'src/common/dtos/PaginationQuery.dto';
import { ApiResponse, fail, ok } from 'src/common/helper/api-response.dto';
import { BidEntity } from './bid.entity';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dtos/create-bid.dto';
import { ResponseBidDto } from './dtos/response-bid.dto';
import { UpdateBidDto } from './dtos/update-bid';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/bids')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BidsController {
  constructor(private readonly bidsService: BidsService) { }

  @Post()
  async create(
    @Body() dto: CreateBidDto,
    @Req() req: any
  ): Promise<ApiResponse<ResponseBidDto>> {
    const userId = req.user.sub;

    const entity = new BidEntity();
    entity.amount = dto.amount;
    entity.itemId = dto.itemId;
    entity.userId = userId;

    const result = await this.bidsService.create(entity);

    if (!result.isSuccess) {
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
    if (!result.isSuccess) {
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
    if (!result.items.isSuccess) {
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
    if (!result.isSuccess) {
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
    const result = await this.bidsService.update(id, dto);

    if (!result.isSuccess) {
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
    if (!result.isSuccess) {
      return fail(result.message!, result.code);
    }
    return ok(null, 200);
  }

  @Get('item/:itemId')
  async getByItem(
    @Param('itemId') itemId: string
  ): Promise<ApiResponse<ResponseBidDto[]>> {
    try {
      const bids = await this.bidsService.findByItemId(itemId);

      const dtos = plainToInstance(ResponseBidDto, bids, {
        excludeExtraneousValues: true,
      });

      return ok(dtos);

    } catch (error) {
      console.error('Error fetching bids by item:', error);
      return fail('Failed to fetch bids', 500);
    }
  }

}