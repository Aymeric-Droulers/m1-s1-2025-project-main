import { AuthorId } from './author.entity';
import { BookModel } from '../books/book.model';

export type AuthorModel = {
  id: AuthorId;
  firstName: string;
  lastName: string;
  pictureUrl?: string;
  booksCount: number;
  averageSalesPerBook: number;
};

export type CreateAuthorModel = {
  firstName: string;
  lastName: string;
  pictureUrl?: string;
};

export type AuthorDetailsModel = AuthorModel & {
  books: BookModel[];
};

export type UpdateAuthorModel = Partial<CreateAuthorModel>;