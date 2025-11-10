import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    operationId: 'getUsers',
  })
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();

    return plainToInstance(UserResponseDto, users);
  }

  @Get('by-id/:id')
  @ApiOperation({
    summary: 'Get user by ID',
    operationId: 'getUserById',
  })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return plainToInstance(UserResponseDto, user);
  }

  @Get('by-email/:email')
  @ApiOperation({
    summary: 'Get user by email',
    operationId: 'getUserByEmail',
  })
  async findByEmail(@Param('email') email: string): Promise<UserResponseDto> {
    const user = await this.usersService.findByEmail(email);
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);
    return plainToInstance(UserResponseDto, user);
  }

  @Get('by-username/:username')
  @ApiOperation({
    summary: 'Get user by username',
    operationId: 'getUserByUsername',
  })
  async findByUserName(
    @Param('username') username: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findByUsername(username);
    if (!user)
      throw new NotFoundException(`User with username ${username} not found`);
    return plainToInstance(UserResponseDto, user);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user by ID',
    operationId: 'updateUser',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserResponseDto: UserUpdateDto,
  ): Promise<UserResponseDto> {
    const updated = await this.usersService.update(id, updateUserResponseDto);
    if (!updated) throw new NotFoundException(`User with id ${id} not found`);
    return plainToInstance(UserResponseDto, updated);
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
