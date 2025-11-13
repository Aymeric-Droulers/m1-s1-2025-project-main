import { Injectable } from '@nestjs/common';
import { AuthorModel, AuthorDetailsModel, CreateAuthorModel, UpdateAuthorModel } from './author.model';
import { AuthorEntity, AuthorId } from './author.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,
  ) {}


  private toModel(entity: AuthorEntity): AuthorModel {
    const books = entity.books ?? [];
    const booksCount = books.length;

    const totalSales = books.reduce((sum, book) => {
      // book.sells vient de BookEntity (relation OneToMany)
      const sells = (book as any).sells as { id: string }[] | undefined;
      // Version sans any :
      //const sells = book.sells ?? [];
      return sum + (sells?.length ?? 0);
    }, 0);
    const averageSalesPerBook = booksCount > 0 ? totalSales / booksCount : 0;

    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      pictureUrl: entity.pictureUrl,
      booksCount,
      averageSalesPerBook,
    };
  }


  public async getAllAuthors(): Promise<AuthorModel[]> {
    const authors = await this.authorRepository.find({
      relations: {
        books: {
          // on veut aussi les sells pour calculer les stats
          sells: true,
        },
      },
      order: {
        lastName: 'ASC',
        firstName: 'ASC',
      },
    });

     return authors.map((author) => this.toModel(author));
  }
  


  public async findById(id: AuthorId): Promise<AuthorModel | null> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: {
        books: {
          sells: true,
        },
      },
    });

    return author ? this.toModel(author) : null;
  }

  
  public async createAuthor(author: CreateAuthorModel): Promise<AuthorModel> {
    const entity = this.authorRepository.create({
      firstName: author.firstName,
      lastName: author.lastName,
      pictureUrl: author.pictureUrl,
    });

    const saved = await this.authorRepository.save(entity);
    // on recharge avec relations pour avoir les stats cohérentes
    const reloaded = await this.authorRepository.findOne({
      where: { id: saved.id },
      relations: { books: { sells: true } },
    });

    if (!reloaded) {
      throw new Error('Author not found after creation');
    }
    
    return this.toModel(reloaded);
  }


   public async updateAuthor(
    id: AuthorId,
    patch: UpdateAuthorModel,
  ): Promise<AuthorModel | null> {

    await this.authorRepository.update(id, patch);
    const updated = await this.authorRepository.findOne({
      where: { id },
      relations: { books: { sells: true } },
    });

    return updated ? this.toModel(updated) : null;
  }

  public async removeAuthor(id: AuthorId): Promise<void> {
    await this.authorRepository.delete(id);
  }


}
