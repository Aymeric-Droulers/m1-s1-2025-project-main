import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { BookEntity, BookId } from './entities/book.entity';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthorEntity } from '../authors/author.entity';

export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

type FindAllArgs = {
  page?: number;
  limit?: number;
  search?: string;
  authorId?: string;
};

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly repo: Repository<BookEntity>, // TypeORM repository for BookEntity
  ) {}

  // Create a new book linked to an existing author
  async create(dto: {
    title: string;
    description?: string;
    pictureUrl?: string;
    yearPublished?: number;
    authorId: string;
  }) {
    const { authorId, ...rest } = dto;
    const entity = this.repo.create({
      // Build a new BookEntity
      ...rest,
      author: { id: authorId } as AuthorEntity, // Link to existing author by ID
    });
    return this.repo.save(entity);
  }

  async findAll({ page = 1, limit = 10, search, authorId }: FindAllArgs) {
    // Retrieve paginated list of books with optional search and author filter
    const where: FindOptionsWhere<BookEntity> = {}; // Build the WHERE clause
    if (search) where.title = Like(`%${search}%`); // Filter by title if search provided
    if (authorId)
      where.author = { id: authorId } as FindOptionsWhere<AuthorEntity>; // Filter by authorId if provided

    const [items, total] = await this.repo.findAndCount({
      // We use findAndCount to get items and total count
      where,
      relations: { author: true },
      order: { title: 'ASC', id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  async findOne(id: BookId): Promise<BookEntity> {
    // Retrieve a single book by its ID
    const book = await this.repo.findOne({
      where: { id },
      relations: { author: true },
    });
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }

  async update(id: BookId, dto: UpdateBookDto): Promise<BookEntity> {
    // Update an existing book with partial data
    const existing = await this.findOne(id);

    const patch: Partial<BookEntity> & { author?: AuthorEntity | null } = {
      title: dto.title,
      description: dto.description,
      pictureUrl: dto.pictureUrl,
      yearPublished: dto.yearPublished,
    };
    if (dto.authorId !== undefined) {
      patch.author = dto.authorId
        ? ({ id: dto.authorId } as AuthorEntity)
        : null;
    }

    const merged = this.repo.merge(existing, patch);
    return this.repo.save(merged);
  }

  async remove(id: BookId): Promise<void> {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException(`Book ${id} not found`);
  }
}
