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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthorsService } from './authors.service';
import { CreateAuthorDTO } from './dtos/create-author.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) { }

  @Get('/')
  getAll() {
    return this.authorsService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const author = await this.authorsService.getById(id);

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    return author;
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  create(@Body() authorData: CreateAuthorDTO) {
    return this.authorsService.create(authorData);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async updateById(
    @Body() authorData: CreateAuthorDTO,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    if (!(await this.authorsService.getById(id)))
      throw new NotFoundException('Author not found');

    await this.authorsService.updateById(id, authorData);
    return { success: true };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.authorsService.getById(id)))
      throw new NotFoundException('Author not found');

    await this.authorsService.deleteById(id);
    return { success: true };
  }
}
