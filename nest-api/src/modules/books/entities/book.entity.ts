import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthorEntity } from '../../authors/author.entity';
import { SellsEntity } from '../../clients/entities/sells.entity';

export type BookId = string;

@Entity({ name: 'books' })
export class BookEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: BookId;

  @Index()
  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ length: 1024, nullable: true })
  pictureUrl?: string;

  @Column({ type: 'int', default: 1970 })
  yearPublished!: number;

  @ManyToOne(() => AuthorEntity, (author) => author.books, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'authorId' })
  author!: AuthorEntity | null;

  // To satisfy SellsEntity’s inverse side: book => book.sells
  @OneToMany(() => SellsEntity, (sell) => sell.book)
  sells!: SellsEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
