import { ConflictException, Injectable } from '@nestjs/common';
import { Password, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) { }

  getAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  getById(id: User['id']): Promise<User> | null {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getByEmail(
    email: User['email'],
  ): Promise<(User & { password: Password; }) | null> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: { password: true },
    });
  }

  async create(
    userData: Omit<User, 'id' | 'role'>,
    password: string,
  ): Promise<User> {
    try {
      return await this.prismaService.user.create({
        data: {
          ...userData,
          password: {
            create: {
              hashedPassword: password,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('User with this email already exists');
        throw error;
      }
    }
  }

  async updateById(
    id: User['id'],
    userData,
    password: string | undefined,
  ): Promise<User> {
    try {
      if (password) {
        return await this.prismaService.user.update({
          where: {
            id,
          },
          data: {
            ...userData,
            password: {
              update: {
                hashedPassword: password,
              },
            },
          },
        });
      }
      return await this.prismaService.user.update({
        where: { id },
        data: userData,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
        throw error;
      }
    }
  }

  deleteById(id: User['id']): Promise<User> {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
