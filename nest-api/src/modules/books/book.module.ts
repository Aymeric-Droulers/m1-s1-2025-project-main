import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { BooksService } from './book.service';
import { BooksController } from './book.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity])],
  providers: [BooksService],
  controllers: [BooksController],
  exports: [BooksService],
})
export class BookModule {}
