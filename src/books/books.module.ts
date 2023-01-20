import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { AuthorsService } from 'src/authors/authors.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, AuthorsService, PrismaService],
})
export class BooksModule { }
