import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Put,
  Param,
  ConflictException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiResponse } from '../common/helper/api-response.dto';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dtos/user-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<Omit<UserResponseDto, 'password'>>> {
    try {
      const userEntity = await this.usersService.create(createUserDto);
      const userDto = plainToInstance(UserResponseDto, userEntity);
      return ApiResponse.ok(userDto, 'User created successfully');
    } catch (error) {
      if (error instanceof ConflictException) {
        return ApiResponse.fail(error.message);
      }
      return ApiResponse.fail('Failed to create user');
    }
  }

  @Get()
  async findAll() {
    const userEntities = await this.usersService.findAll();
    const userDtos = plainToInstance(UserResponseDto, userEntities, {
      excludeExtraneousValues: true,
    });
    return ApiResponse.ok(userDtos);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'User ID (UUID or number)' })
  async findOne(@Param('id') id: string): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.usersService.findOne(id);
    const userDto = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    return ApiResponse.ok(userDto);
  }

  @Get()
  async findByEmail(email: string) {
    const userEntity = await this.usersService.findByEmail(email);
    const userDto = plainToInstance(UserResponseDto, userEntity, {
      excludeExtraneousValues: true,
    });
    return ApiResponse.ok(userDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'User ID' })
  async softDelete(@Param('id') id: string): Promise<ApiResponse<null>> {
    await this.usersService.softDelete(id);
    return ApiResponse.ok(null, 'User deleted successfully');
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'User ID' })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateUserDto: Partial<CreateUserDto>,
  ): Promise<ApiResponse<UserResponseDto>> {
    const user = await this.usersService.updateUser(id, updateUserDto);
    const userDto = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    return ApiResponse.ok(userDto, 'User updated successfully');
  }
}
