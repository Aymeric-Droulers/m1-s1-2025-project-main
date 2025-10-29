import { BookId } from '../../books/entities/book.entity';
import { ClientId } from '../entities/client.entity';

export type CreateSellModel = {
  date: Date;
  bookId: BookId;
  clientId: ClientId;
};
