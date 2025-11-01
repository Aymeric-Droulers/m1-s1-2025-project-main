import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientEntity } from './client.entity';
import { BookEntity } from '../../books/entities/book.entity';

export type SellId = string & { __brand: 'Sell' };

@Entity('sells')
export class SellsEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: SellId;

  @Column({ name: 'date', type: 'date' })
  date: Date;

  @ManyToOne(() => ClientEntity, (client: ClientEntity) => client.books_bought)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @ManyToOne(() => BookEntity, (book) => book.sells)
  @JoinColumn({ name: 'book_id' })
  book: BookEntity;
}
