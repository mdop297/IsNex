import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto, toUserDto, UserDto } from './dto/find-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    operationId: 'getUsers',
  })
  async findAll(): Promise<UserDto[]> {
    const users = await this.usersService.findAll();
    return users.map(toUserDto);
  }

  @Get('by-id/:id')
  @ApiOperation({
    summary: 'Get user by ID',
    operationId: 'getUserById',
  })
  async findById(@Param('id') id: string): Promise<UserDto> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return toUserDto(user);
  }

  @Get('by-email/:email')
  @ApiOperation({
    summary: 'Get user by email',
    operationId: 'getUserByEmail',
  })
  async findByEmail(@Param('email') email: string): Promise<UserDto> {
    const user = await this.usersService.findByEmail(email);
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
    return toUserDto(user);
  }

  @Get('by-username/:username')
  @ApiOperation({
    summary: 'Get user by username',
    operationId: 'getUserByUsername',
  })
  async findByUserName(@Param('username') username: string): Promise<UserDto> {
    const user = await this.usersService.findByUsername(username);
    if (!user)
      throw new NotFoundException(`User with username ${username} not found`);
    return toUserDto(user);
  }

  @Get('filter')
  @ApiOperation({
    summary: 'Filter users by query',
    operationId: 'filterUsers',
  })
  async findUsers(@Query() filter: FindUserDto): Promise<UserDto[]> {
    const users = await this.usersService.findUsers(filter);
    return users.map(toUserDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user by ID',
    operationId: 'updateUser',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const updated = await this.usersService.update(id, updateUserDto);
    if (!updated) throw new NotFoundException(`User with id ${id} not found`);
    return toUserDto(updated);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user by ID',
    operationId: 'deleteUser',
  })
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    const deleted = await this.usersService.remove(id);
    if (!deleted) throw new NotFoundException(`User with id ${id} not found`);
    return { success: true };
  }
}
