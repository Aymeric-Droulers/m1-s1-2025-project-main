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
    private readonly repo: Repository<BookEntity>,
  ) {}

  async create(dto: {
    title: string;
    description?: string;
    pictureUrl?: string;
    yearPublished?: number;
    authorId: string;
  }) {
    const { authorId, ...rest } = dto;
    const entity = this.repo.create({
      ...rest,
      author: { id: authorId } as AuthorEntity,
    });
    return this.repo.save(entity);
  }

  async findAll({ page = 1, limit = 10, search, authorId }: FindAllArgs) {
    const where: FindOptionsWhere<BookEntity> = {};
    if (search) where.title = Like(`%${search}%`);
    if (authorId)
      where.author = { id: authorId } as FindOptionsWhere<AuthorEntity>;

    const [items, total] = await this.repo.findAndCount({
      where,
      relations: { author: true }, // <-- brings back author
      order: { title: 'ASC', id: 'ASC' }, // match old query ordering
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  async findOne(id: BookId): Promise<BookEntity> {
    const book = await this.repo.findOne({
      where: { id },
      relations: { author: true },
    });
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }

  async update(id: BookId, dto: UpdateBookDto): Promise<BookEntity> {
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
