import { AuthorId } from '../authors/author.entity';
import { SellsEntity } from '../clients/entities/sells.entity';

export type BookAuthorModel = {
  firstName: string;
  lastName: string;
};

export type BookModel = {
  id: string;
  title: string;
  author: BookAuthorModel;
  yearPublished: number;
  sells?: SellsEntity[];
  description?: string;
  pictureUrl?: string;
};

export type CreateBookModel = {
  title: string;
  authorId: AuthorId;
  yearPublished: number;
  description?: string;
  pictureUrl?: string;
};

export type UpdateBookModel = Partial<CreateBookModel>;

export type FilterBooksModel = {
  limit: number;
  offset: number;
  sort?: Partial<Record<keyof BookModel, 'ASC' | 'DESC'>>;
};

export type GetBooksModel = {
  totalCount: number;
  data: BookModel[];
};
