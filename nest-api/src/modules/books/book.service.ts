import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { BookEntity, BookId } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly repo: Repository<BookEntity>,
  ) {}

  async create(dto: CreateBookDto): Promise<BookEntity> {
    const entity = this.repo.create({
      title: dto.title,
      description: dto.description,
      pictureUrl: dto.pictureUrl,
      yearPublished: dto.yearPublished,
      author: { id: dto.authorId } as any,
    });
    return this.repo.save(entity);
  }

  async findAll(opts?: { page?: number; limit?: number; search?: string }): Promise<Paginated<BookEntity>> {
    const page = Math.max(1, Number(opts?.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(opts?.limit ?? 20)));
    const search = (opts?.search ?? '').trim();

    const where = search ? { title: Like(`%${search}%`) } : {};

    const [data, total] = await this.repo.findAndCount({
      where,
      order: { title: 'ASC', id: 'ASC' },
      relations: { author: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, meta: { total, page, limit } };
  }

  async findOne(id: BookId): Promise<BookEntity> {
    const book = await this.repo.findOne({ where: { id }, relations: { author: true } });
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }

  async update(id: BookId, dto: UpdateBookDto): Promise<BookEntity> {
    const existing = await this.findOne(id);

    const patch: Partial<BookEntity> & { author?: any } = {
      title: dto.title,
      description: dto.description,
      pictureUrl: dto.pictureUrl,
      yearPublished: dto.yearPublished,
    };
    if (dto.authorId !== undefined) {
      patch.author = dto.authorId ? ({ id: dto.authorId } as any) : null;
    }

    const merged = this.repo.merge(existing, patch);
    return this.repo.save(merged);
  }

  async remove(id: BookId): Promise<void> {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException(`Book ${id} not found`);
  }
}