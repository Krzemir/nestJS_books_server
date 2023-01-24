import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { AuthorsService } from 'src/authors/authors.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, AuthorsService, UsersService],
  imports: [PrismaModule],
})
export class BooksModule { }
