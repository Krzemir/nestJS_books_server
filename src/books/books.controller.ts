import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { AuthorsService } from 'src/authors/authors.service';
import { CreateBookDTO } from './dtos/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(
    private booksService: BooksService,
    private authorService: AuthorsService,
  ) { }

  @Get('/')
  getAll() {
    return this.booksService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const book = await this.booksService.getById(id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  @Post('/')
  async create(@Body() bookData: CreateBookDTO) {
    if (bookData.authorId) {
      const author = await this.authorService.getById(bookData.authorId);
      if (!author) throw new NotFoundException('Author not found');
    }
    return this.booksService.create(bookData);
  }

  @Put('/:id')
  async updateById(
    @Body() bookData: CreateBookDTO,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    if (!(await this.booksService.getById(id)))
      throw new NotFoundException('Book not found');

    if (bookData.authorId) {
      const author = await this.authorService.getById(bookData.authorId);
      if (!author) throw new NotFoundException('Author not found');
    }

    await this.booksService.updateById(id, bookData);
    return { success: true };
  }

  @Delete('/:id')
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.booksService.getById(id)))
      throw new NotFoundException('Book not found');

    await this.booksService.deleteById(id);
    return { success: true };
  }
}
