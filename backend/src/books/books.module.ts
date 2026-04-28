import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book])], // Bu satır olmadan BooksService içindeki hiçbir veritabanı komutu (kaydet, bul, sil) çalışmaz. 
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}