import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BooksService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookEntity } from './entities/book.entity';
import type { BookId } from './entities/book.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly svc: BooksService) {}

  @Post()
  create(
    @Body() dto: CreateBookDto,
    @Query('authorId') authorIdQ?: string,
  ): Promise<BookEntity> {
    const authorId = dto.authorId ?? authorIdQ;
    if (!authorId) throw new BadRequestException('authorId requis');
    return this.svc.create({ ...dto, authorId });
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('authorId') authorId?: string,
  ) {
    const res = await this.svc.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search ?? undefined,
      authorId: authorId ?? undefined,
    });

    return {
      books: res.items,
      total: res.total,
      page: res.page,
      limit: res.limit,
    };
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: BookId) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: BookId,
    @Body() dto: UpdateBookDto,
  ) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: BookId) {
    return this.svc.remove(id);
  }
}
