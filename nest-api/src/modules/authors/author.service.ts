import { Injectable, NotFoundException  } from '@nestjs/common';
import { AuthorId } from './author.entity';
import { AuthorModel, AuthorDetailsModel, CreateAuthorModel, UpdateAuthorModel } from './author.model';
import { AuthorRepository } from './author.repository';

@Injectable()
export class AuthorService {
  constructor(private readonly authorRepository: AuthorRepository) {}

  public async getAllAuthors(): Promise<AuthorModel[]> {
    return this.authorRepository.getAllAuthors();
  }

  public async getAuthorById(id: AuthorId): Promise<AuthorDetailsModel> {
    const author = await this.authorRepository.findById(id);
    if (!author) {
      throw new NotFoundException(`Author ${id} not found`);
    }
    return author;
  }

  public async createAuthor(author: CreateAuthorModel): Promise<AuthorModel> {
    return this.authorRepository.createAuthor(author);
  }

   public async updateAuthor(
    id: AuthorId,
    patch: UpdateAuthorModel,
  ): Promise<AuthorModel> {
    const updated = await this.authorRepository.updateAuthor(id, patch);
    if (!updated) {
      throw new NotFoundException(`Author ${id} not found`);
    }
    return updated;
  }

  public async removeAuthor(id: AuthorId): Promise<void> {
    return this.authorRepository.removeAuthor(id);
  }
}
