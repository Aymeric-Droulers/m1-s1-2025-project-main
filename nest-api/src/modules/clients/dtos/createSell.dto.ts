import { IsDate, IsUUID } from 'class-validator';
import type { ClientId } from '../entities/client.entity';
import type { BookId } from '../../books/entities/book.entity';

export class CreateSellDto {
  @IsUUID()
  clientId: ClientId;

  @IsUUID()
  bookId: BookId;

  @IsDate()
  date: Date;
}
