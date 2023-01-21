import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Book } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) { }

  getAll(): Promise<Book[]> {
    return this.prismaService.book.findMany();
  }

  getById(id: Book['id']): Promise<Book> | null {
    return this.prismaService.book.findUnique({
      where: {
        id,
      },
      include: { author: true },
    });
  }

  async create(
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    try {
      return await this.prismaService.book.create({
        data: bookData,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Book already exists');
        throw error;
      }
    }
  }

  async updateById(
    id: Book['id'],
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    try {
      return await this.prismaService.book.update({
        where: {
          id,
        },
        data: bookData,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Title already exists');
        throw error;
      }
    }
  }

  deleteById(id: Book['id']): Promise<Book> {
    return this.prismaService.book.delete({
      where: {
        id,
      },
    });
  }
}
