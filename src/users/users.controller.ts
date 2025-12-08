import {
  Controller,
  Post,
  Body,
  ConflictException,
  Get,
  Put,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiResponse, ok, fail } from '../common/helper/api-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dtos/user-response.dto';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { PaginationQueryDto } from 'src/common/dtos/PaginationQuery.dto';
import { ApiParam } from '@nestjs/swagger';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(
    @Body() dto: CreateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    const userExist = await this.usersService.findByEmail(dto.email);
    if (userExist) {
      return fail('User already exists', 409);
    }

    dto.password = await bcrypt.hash(dto.password, 10);
    const entity = plainToInstance(UserEntity, dto);
    const result = await this.usersService.create(entity);

    if (result.isError) {
      return fail(result.message!, result.code);
    }

    const responseDto = plainToInstance(UserResponseDto, result.data, {
      excludeExtraneousValues: true,
    });
    return ok(responseDto, 201);
  }

  @Get()
  async findAll(): Promise<ApiResponse<UserResponseDto[]>> {
    const result = await this.usersService.getAll();
    if (result.isError) {
      return fail(result.message!, result.code);
    }

    const dataArray = Array.isArray(result.data) ? result.data : [];

    const responseDtos = plainToInstance(UserResponseDto, dataArray, {
      excludeExtraneousValues: true,
    });

    return ok(responseDtos);
  }

  @Get('paged')
  async getPaged(
    @Query() query: PaginationQueryDto,
  ): Promise<ApiResponse<any>> {
    const result = await this.usersService.getPaged(query);
    if (result.items.isError) {
      return fail(result.items.message!, result.items.code);
    }

    const responseDtos = plainToInstance(UserResponseDto, result.items.data, {
      excludeExtraneousValues: true,
    });

    return ok(
      {
        items: responseDtos,
        totalCount: result.totalCount,
      },
      200,
    );
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponse<UserResponseDto>> {
    const result = await this.usersService.getById(id);
    if (result.isError) {
      return fail(result.message!, result.code);
    }

    const responseDto = plainToInstance(UserResponseDto, result.data, {
      excludeExtraneousValues: true,
    });
    return ok(responseDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    const entity = plainToInstance(UserEntity, dto);
    const result = await this.usersService.update(id, entity);

    if (result.isError) {
      return fail(result.message!, result.code);
    }

    const responseDto = plainToInstance(UserResponseDto, result.data, {
      excludeExtraneousValues: true,
    });
    return ok(responseDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<null>> {
    const result = await this.usersService.softDelete(id);
    if (result.isError) {
      return fail(result.message!, result.code);
    }
    return ok(null, 200);
  }
}