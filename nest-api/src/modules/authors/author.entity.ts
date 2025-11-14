import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookEntity } from '../books/entities/book.entity';

export type AuthorId = string & { __brand: 'Author' };

@Entity('authors')
export class AuthorEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: AuthorId;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string;

  @Column({ name: 'picture_url', type: 'varchar', nullable: true })
  pictureUrl?: string;

  @OneToMany(() => BookEntity, (book) => book.author)
  books: BookEntity[];

// Va permettre de retirer le any dans author.repository.ts
//@OneToMany(() => SellsEntity, (sell) => sell.book)
//sells!: SellsEntity[];

}
