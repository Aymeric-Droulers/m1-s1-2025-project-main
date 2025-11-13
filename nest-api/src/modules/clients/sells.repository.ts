import { InjectRepository } from '@nestjs/typeorm';
import { SellsEntity } from './entities/sells.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateSellModel } from './models/createSell.model';
import { ClientEntity } from './entities/client.entity';
import { BookEntity } from '../books/entities/book.entity';

@Injectable()
export class SellsRepository {
  constructor(
    @InjectRepository(SellsEntity)
    private readonly sellsRepository: Repository<SellsEntity>,
    private readonly dataSource: DataSource,
    @InjectRepository(ClientEntity)
    private readonly clientsRepository: Repository<ClientEntity>,
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
  ) {}

  public async createSell(data: CreateSellModel): Promise<SellsEntity> {
    const client = await this.clientsRepository.findOne({
      where: { id: data.clientId },
    });
    const book = await this.booksRepository.findOne({
      where: { id: data.bookId },
    });
    if (!client || !book) {
      throw new Error('Client or Book is undefined');
    }
    return this.sellsRepository.save(
      this.sellsRepository.create({
        date: data.date ?? new Date(),
        client,
        book,
      }),
    );
  }

  public async getSellsByBookId(bookId: string): Promise<SellsEntity[]> {
    return await this.sellsRepository.find({
      where: {
        book: { id: bookId },
      },
      relations: ['client', 'client.books_bought'],
    });
  }
}
