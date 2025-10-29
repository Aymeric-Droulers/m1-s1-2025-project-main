import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { BookEntity } from '../../books/entities/book.entity';
import { SellsEntity } from './sells.entity';

export type ClientId = string & { __brand: 'Client' };

@Entity('client')
export class ClientEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: ClientId;

  @Column({ name: 'first_name', type: 'varchar' })
  first_name: string;

  @Column({ name: 'last_name', type: 'varchar' })
  last_name: string;

  @Column({ name: 'mail', type: 'varchar', nullable: true })
  mail: string;

  @Column({ name: 'photo_link', type: 'varchar', nullable: true })
  photo_link: string;

  @OneToMany(
    () => SellsEntity,
    (sells: SellsEntity): ClientEntity => sells.client,
  )
  books_bought: SellsEntity[];
}
