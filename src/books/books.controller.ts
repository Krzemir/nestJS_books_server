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
  Request,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { UsersService } from 'src/users/users.service';
import { AuthorsService } from 'src/authors/authors.service';
import { CreateBookDTO } from './dtos/create-book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
  constructor(
    private booksService: BooksService,
    private authorService: AuthorsService,
    private userService: UsersService,
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
  @UseGuards(JwtAuthGuard)
  async create(@Body() bookData: CreateBookDTO) {
    if (bookData.authorId) {
      const author = await this.authorService.getById(bookData.authorId);
      if (!author) throw new NotFoundException('Author not found');
    }
    return this.booksService.create(bookData);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.booksService.getById(id)))
      throw new NotFoundException('Book not found');

    await this.booksService.deleteById(id);
    return { success: true };
  }

  @Post('/like/:id')
  @UseGuards(JwtAuthGuard)
  async bookLike(@Param('id', new ParseUUIDPipe()) id: string, @Request() req) {
    const userId = req.user.id;
    const bookId = id;

    if (
      !(
        (await this.booksService.getById(bookId)) &&
        (await this.userService.getById(userId))
      )
    )
      throw new NotFoundException('Book or User not found');

    await this.booksService.bookLike(bookId, userId);
    return { success: true };
  }
}
