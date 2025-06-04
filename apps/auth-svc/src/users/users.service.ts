import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

import { genSaltSync, hashSync } from 'bcryptjs';
import { FindUserDto } from './dto/find-user.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data: {
        ...data,
        password: this.hashPassword(data.password),
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { username: { contains: username, mode: 'insensitive' } },
    });
  }

  async findUsers(filter: FindUserDto): Promise<User[]> {
    const where: Prisma.UserWhereInput = {};

    if (filter.username) {
      where.username = {
        contains: filter.username,
        mode: 'insensitive',
      };
    }

    if (filter.address) {
      where.address = {
        contains: filter.address,
        mode: 'insensitive',
      };
    }

    return this.prisma.user.findMany({ where });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const { id, ...data } = updateUserDto;
      const result = this.prisma.user.update({
        where: { id },
        data: { ...data },
      });
      return result;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private handlePrismaError(error: Error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = error?.meta?.target as string[];
        if (target?.includes('email')) {
          throw new ConflictException('Email already exists');
        } else if (target?.includes('username')) {
          throw new ConflictException('Username already exists');
        } else {
          throw new ConflictException('A unique constraint error occurred');
        }
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Record not found');
      }
    }
    console.log(error);
    throw new InternalServerErrorException(
      'Authentication Service Error. Please try again later. ',
    );
  }
}
