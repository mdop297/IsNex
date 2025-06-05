import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { FindUserDto } from './dto/find-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('by-id/:id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Get('by-email/:email')
  async findByEmail(@Param('email') email: string): Promise<User | null> {
    return await this.usersService.findByEmail(email);
  }

  @Get('by-username/:username')
  async findByUserName(
    @Param('username') username: string,
  ): Promise<User | null> {
    return await this.usersService.findByUsername(username);
  }

  @Get('filter')
  async findUsers(@Query() filter: FindUserDto): Promise<User[]> {
    return this.usersService.findUsers(filter);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
