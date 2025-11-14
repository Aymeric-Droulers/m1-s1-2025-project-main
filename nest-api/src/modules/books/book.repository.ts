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

  // We map a BookEntity (representation in DB) to a BookModel (representation in API)
  private toModel(e: BookEntity): BookModel {
    return {
      id: e.id,
      title: e.title,
      description: e.description,
      pictureUrl: e.pictureUrl,
      yearPublished: e.yearPublished,
      author: e.author as AuthorEntity, // We must cast because author is nullable in BookEntity
    };
  }

  async findAll(
    // Find list of existing books with optional pagination and search
    params: { page?: number; limit?: number; search?: string } = {},
  ): Promise<[BookModel[], number]> {
    const page = Math.max(1, Number(params.page ?? 1)); // We ensure page is at least 1 (and a number)
    const limit = Math.min(100, Math.max(1, Number(params.limit ?? 20))); // We clamp limit between 1 and 100
    const search = params.search?.trim();

    const [rows, total] = await this.bookRepository.findAndCount({
      // We get the number of rows matching the query
      where: search ? { title: ILike(`%${search}%`) } : {},
      order: { title: 'ASC', id: 'ASC' },
      relations: ['author'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return [rows.map((e) => this.toModel(e)), total]; // We map the entities to models and return them with the total count
  }

  async findById(id: BookId): Promise<BookModel | null> {
    // Find a book by its ID
    const row = await this.bookRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    return row ? this.toModel(row) : null;
  }

  async create(book: CreateBookModel): Promise<BookModel> {
    // Create a new book from CreateBookModel
    const entity = this.bookRepository.create({
      // Create a new BookEntity with fields from the DTO
      title: book.title,
      description: book.description,
      pictureUrl: book.pictureUrl,
      yearPublished: book.yearPublished,
      author: book.authorId // Add the author relation if authorId is provided
        ? ({ id: book.authorId } as AuthorEntity)
        : undefined,
    });

    const saved = await this.bookRepository.save(entity); // Save the entity to the database
    const withAuthor = await this.bookRepository.findOne({
      // Load the saved entity again to get the author relation
      where: { id: saved.id },
      relations: ['author'],
    });
    return this.toModel(withAuthor!); // Convert to BookModel and return
  }

  async update(
    // Update an existing book by its ID with partial fields from CreateBookModel
    id: BookId,
    book: Partial<CreateBookModel>,
  ): Promise<BookModel | null> {
    const patch: Partial<BookEntity> & {
      author?: AuthorEntity | undefined;
      authorId?: string;
    } = {
      ...book,
    } as Partial<BookEntity> & {
      author?: AuthorEntity | undefined;
      authorId?: string;
    };

    if ('authorId' in book) {
      patch.author = book.authorId // If the payload contains authorId, we set the author relation accordingly
        ? ({ id: book.authorId } as AuthorEntity)
        : undefined;
      delete patch.authorId; // Then remove the authorId field so TypeORM does not try to persist it
    }

    await this.bookRepository.update(id, patch); // Apply the partial update
    const reloaded = await this.bookRepository.findOne({
      // Reload the updated entity with author relation
      where: { id },
      relations: ['author'],
    });
    return reloaded ? this.toModel(reloaded) : null;
  }

  async remove(id: BookId): Promise<void> {
    // Remove a book by its ID
    await this.bookRepository.delete(id);
  }
}
