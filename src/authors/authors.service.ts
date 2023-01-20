import { ConflictException, Injectable } from '@nestjs/common';
import { Author } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class AuthorsService {
  constructor(private prismaService: PrismaService) { }

  getAll(): Promise<Author[]> {
    return this.prismaService.author.findMany();
  }

  getById(id: Author['id']): Promise<Author> | null {
    return this.prismaService.author.findUnique({
      where: {
        id,
      },
    });
  }

  async create(authorData: Omit<Author, 'id'>): Promise<Author> {
    try {
      return await this.prismaService.author.create({
        data: authorData,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Author already exists');
        throw error;
      }
    }
  }

  async updateById(
    id: Author['id'],
    authorData: Omit<Author, 'id'>,
  ): Promise<Author> {
    try {
      return await this.prismaService.author.update({
        where: {
          id,
        },
        data: authorData,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Name is already in use');
        throw error;
      }
    }
  }

  deleteById(id: Author['id']): Promise<Author> {
    return this.prismaService.author.delete({
      where: {
        id,
      },
    });
  }
}
