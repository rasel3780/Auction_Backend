import { Controller, Post, Body } from '@nestjs/common';
import  {UsersService} from './users.service';
import  {CreateUserDto} from './dto/create-user.dto';
import {ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService ){}

  @Post()
  @ApiOperation({summary: 'Create a new user'})
  @ApiResponse({status: 201, description: 'Successfully created'})
  create(@Body() createUserDto: CreateUserDto){
    return this.usersService.create(createUserDto);
  }
}
