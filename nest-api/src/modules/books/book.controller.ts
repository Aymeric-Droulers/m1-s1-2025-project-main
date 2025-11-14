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

  @Post() // POST /books
  create(
    @Body() dto: CreateBookDto, // Request body validated as CreateBookDto
    @Query('authorId') authorIdQ?: string, // Optional authorId passed as query parameter
  ): Promise<BookEntity> {
    const authorId = dto.authorId ?? authorIdQ; // If there is an authorId in the body we use it, otherwise fall back to query parameter
    if (!authorId) throw new BadRequestException('authorId requis'); // If there is no authorId at all, throw error
    return this.svc.create({ ...dto, authorId });
  }

  @Get() // GET /books
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

  @Get(':id') // GET /books/:id
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: BookId) {
    // Retrieve a single book by its UUID
    return this.svc.findOne(id);
  }

  @Patch(':id') // PATCH /books/:id
  update(
    // Update part or all of a book data
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: BookId,
    @Body() dto: UpdateBookDto,
  ) {
    return this.svc.update(id, dto);
  }

  @Delete(':id') // DELETE /books/:id
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: BookId) {
    // Delete a book
    return this.svc.remove(id);
  }
}
