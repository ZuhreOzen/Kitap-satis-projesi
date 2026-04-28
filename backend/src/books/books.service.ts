import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const newBook = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(newBook);
  }

  async findAll() {
    // Admin Paneli ve Müşteri Vitrini için tüm kitapları getirir
    return await this.bookRepository.find({
      order: { id: 'ASC' } // Kitapları ID sırasına göre düzgün listeler
    });
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Kitap (ID: ${id}) bulunamadı.`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.findOne(id); // Önce kitabın var olup olmadığını kontrol et
    Object.assign(book, updateBookDto); // Gelen yeni verileri eski kitabın üzerine yaz
    return await this.bookRepository.save(book);
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    return await this.bookRepository.remove(book);
  }
}