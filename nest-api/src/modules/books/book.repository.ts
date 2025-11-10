import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { BookEntity, BookId } from './entities/book.entity';
import { AuthorEntity } from '../authors/author.entity';
import { BookModel } from './book.model';
import { CreateBookModel } from './book.model';

@Injectable()
export class BookRepository {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}

  private toModel(e: BookEntity): BookModel {
    return {
      id: e.id,
      title: e.title,
      description: e.description,
      pictureUrl: e.pictureUrl,
      yearPublished: e.yearPublished,
      author: (e.author as AuthorEntity)
    };
  }

  async findAll(params: { page?: number; limit?: number; search?: string } = {}): Promise<[BookModel[], number]> {
    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(params.limit ?? 20)));
    const search = params.search?.trim();

    const [rows, total] = await this.bookRepository.findAndCount({
      where: search ? { title: ILike(`%${search}%`) } : {},
      order: { title: 'ASC', id: 'ASC' },
      relations: ['author'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return [rows.map((e) => this.toModel(e)), total];
  }

  async findById(id: BookId): Promise<BookModel | null> {
    const row = await this.bookRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    return row ? this.toModel(row) : null;
  }

  async create(book: CreateBookModel): Promise<BookModel> {
    // map CreateBookModel.authorId → relation
    const entity = this.bookRepository.create({
      title: book.title,
      description: book.description,
      pictureUrl: book.pictureUrl,
      yearPublished: book.yearPublished,
      author: book.authorId ? ({ id: book.authorId } as AuthorEntity) : undefined,
    });

    const saved = await this.bookRepository.save(entity);
    const withAuthor = await this.bookRepository.findOne({
      where: { id: saved.id },
      relations: ['author'],
    });
    return this.toModel(withAuthor!);
  }

  async update(id: BookId, book: Partial<CreateBookModel>): Promise<BookModel | null> {
    // translate authorId if present
    const patch: Partial<BookEntity> & { author?: AuthorEntity | undefined } = { ...book } as any;
    if ('authorId' in (book as any)) {
      patch.author = (book as any).authorId ? ({ id: (book as any).authorId } as AuthorEntity) : undefined;
      delete (patch as any).authorId;
    }

    await this.bookRepository.update(id, patch);
    const reloaded = await this.bookRepository.findOne({
      where: { id },
      relations: { author: true },
    });
    return reloaded ? this.toModel(reloaded) : null;
  }

  async remove(id: BookId): Promise<void> {
    await this.bookRepository.delete(id);
  }
}
