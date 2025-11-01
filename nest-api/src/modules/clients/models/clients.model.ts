import { BookModel } from '../../books/book.model';

export type ClientModel = {
  id: string;
  first_name: string;
  last_name: string;
  mail: string;
  photo_link: string;
  books_bought?: BookModel[] | undefined;
};
