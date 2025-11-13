import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { UsersService } from './users.service';
import { UserUpdateDto } from './dto/update-user.dto';
import {
  PaginatedUserResponseDto,
  UserResponseDto,
} from './dto/response-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** ----------------- GET ALL USERS ----------------- */
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    operationId: 'getUsers',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users (paginated)',
    type: PaginatedUserResponseDto,
  })
  async getAll(@Param('page') page: number): Promise<PaginatedUserResponseDto> {
    const users = await this.usersService.getAll(page);
    const total = await this.usersService.count();
    return plainToInstance(PaginatedUserResponseDto, {
      data: users,
      page,
      total,
    });
  }

  /** ----------------- GET BY ID ----------------- */
  @Get('by-id/:id')
  @ApiOperation({
    summary: 'Get user by ID',
    operationId: 'getUserById',
  })
  @ApiResponse({
    status: 200,
    description: 'User found by ID',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return plainToInstance(UserResponseDto, user);
  }

  /** ----------------- GET BY EMAIL ----------------- */
  @Get('by-email/:email')
  @ApiOperation({
    summary: 'Get user by email',
    operationId: 'getUserByEmail',
  })
  @ApiResponse({
    status: 200,
    description: 'User found by email',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findByEmail(@Param('email') email: string): Promise<UserResponseDto> {
    const user = await this.usersService.findByEmail(email);
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
    return plainToInstance(UserResponseDto, user);
  }

  /** ----------------- GET BY USERNAME ----------------- */
  @Get('by-username/:username')
  @ApiOperation({
    summary: 'Get user by username',
    operationId: 'getUserByUsername',
  })
  @ApiResponse({
    status: 200,
    description: 'User found by username',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findByUserName(
    @Param('username') username: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findByUsername(username);
    if (!user)
      throw new NotFoundException(`User with username ${username} not found`);
    return plainToInstance(UserResponseDto, user);
  }

  /** ----------------- UPDATE USER ----------------- */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update user by ID',
    operationId: 'updateUser',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserResponseDto: UserUpdateDto,
  ): Promise<UserResponseDto> {
    const updated = await this.usersService.update(id, updateUserResponseDto);
    if (!updated) throw new NotFoundException(`User with id ${id} not found`);
    return plainToInstance(UserResponseDto, updated);
  }

  /** ----------------- COUNT USERS ----------------- */
  @Get('count')
  @ApiOperation({
    summary: 'Count number of users',
    operationId: 'countUsers',
  })
  @ApiResponse({
    status: 200,
    description: 'Total number of users',
    schema: { example: 42 },
  })
  async countUsers(): Promise<number> {
    return this.usersService.count();
  }

  /** ----------------- DELETE USER ----------------- */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user by ID',
    operationId: 'deleteUser',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: { example: { success: true } },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    const deleted = await this.usersService.remove(id);
    if (!deleted) throw new NotFoundException(`User with id ${id} not found`);
    return { success: true };
  }
}
