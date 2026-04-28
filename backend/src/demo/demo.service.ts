import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as goldenStateData from './golden-state.json';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DemoService implements OnModuleInit
//Sunucu (Backend) başlatıldığı an, başka hiçbir istek beklemeden içindeki kodları otomatik olarak tetikler.
{
  // Veritabanına doğrudan müdahale etmek için DataSource kullanıyoruz
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    const bookCount = await this.dataSource.getRepository(Book).count();
    if (bookCount === 0) {
      console.log('Veritabanı boş tespit edildi. Golden State otomatik yükleniyor...');
      await this.resetSystemToGoldenState();
    }
  }

  async resetSystemToGoldenState() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    
    // Güvenlik için işlem başlatıyoruz (Ya hep ya hiç kuralı)
    await queryRunner.startTransaction();

    try {
      // 1. Tabloları temizle ve ID'leri (1, 2, 3...) başa sar
      await queryRunner.query(`TRUNCATE TABLE "cart", "books", "users" RESTART IDENTITY CASCADE;`);

      // 2. JSON dosyasındaki verileri al
      const bookRepo = queryRunner.manager.getRepository(Book);
      const userRepo = queryRunner.manager.getRepository(User);

      const newBooks = bookRepo.create(goldenStateData.books);
      const newUsers = userRepo.create(goldenStateData.users);

      // 3. Veritabanına kaydet
      await bookRepo.save(newBooks);
      await userRepo.save(newUsers);

      // İşlemi onayla
      await queryRunner.commitTransaction();
      return { success: true, message: 'Sistem pazarlama demosu (Golden State) için hazır!' };
      
    } catch (error) {
      // Hata olursa hiçbir şeyi silme, işlemi geri al
      await queryRunner.rollbackTransaction();
      console.error('Sıfırlama Hatası:', error);
      throw new InternalServerErrorException('Veriler sıfırlanırken bir hata oluştu.');
    } finally {
      // Bağlantıyı serbest bırak
      await queryRunner.release();
    }
  }
}