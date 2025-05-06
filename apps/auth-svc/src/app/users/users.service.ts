import {
  Body,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { User, Prisma } from '@prisma-client/user';
import { PrismaClientKnownRequestError } from '@prisma-client/user/runtime/library';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      const result = await this.prisma.user.create({
        data: {
          ...data,
          password: this.getHashPassword(data.password),
          name: data.email.split('@')[0],
        },
      });

      return result;
    } catch (error) {
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
      } else {
        throw new InternalServerErrorException(
          'Authentication Service Error. Can not create user.',
        );
      }
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
