import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';
import { ClientController } from './client.controller';
import { ClientRepository } from './client.repository';
import { ClientService } from './client.service';
import { SellsEntity } from './entities/sells.entity';
import { SellsRepository } from './sells.repository';
import { BookRepository } from '../books/book.repository';
import { BookEntity } from '../books/entities/book.entity';
import { AuthorEntity } from '../authors/author.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClientEntity,
      SellsEntity,
      BookEntity,
      AuthorEntity,
    ]),
  ],
  controllers: [ClientController],
  providers: [ClientRepository, SellsRepository, BookRepository, ClientService],
})
export class ClientModule {}
