import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { User, Prisma } from '@prisma-client/user';
import { PrismaClientKnownRequestError } from '@prisma-client/user/runtime/library';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  isValidId(id: any): boolean {
    const num = Number(id);
    return Number.isInteger(num) && num > 0;
  }

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
          username: data.email.split('@')[0],
        },
      });

      return result;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with Email ${email} not found`);
    }
    return user;
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      const { id, ...data } = updateUserDto;
      const result = await this.prisma.user.update({
        where: {
          id: +id,
        },
        data: {
          ...data,
        },
      });
      console.log(result);
      return result;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.prisma.user.delete({
        where: {
          id: id,
        },
      });
      return result;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: any) {
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
    }
    if (error.code === 'P2025') {
      throw new NotFoundException('Record not found');
    }
    console.log(error);
    throw new InternalServerErrorException(
      'Authentication Service Error. Please try again later. ',
    );
  }
}
