import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CartItem } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { Book } from '../books/entities/book.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartRepository: Repository<CartItem>,
    private dataSource: DataSource,
  ) {}

  // Sepete ürün ekle
  async addToCart(createCartDto: CreateCartDto) {
    const bookRepo = this.dataSource.getRepository(Book);
    const book = await bookRepo.findOne({ where: { id: createCartDto.bookId } });

    if (!book) {
      throw new NotFoundException('Kitap bulunamadı.');
    }

    if (book.stock <= 0) {
      throw new BadRequestException('Bu kitap stokta bulunmuyor.');
    }

    const existingCartItem = await this.cartRepository.findOne({
      where: {
        user: { id: createCartDto.userId } as any,
        book: { id: createCartDto.bookId } as any,
      },
      relations: ['book'],
    });

    const requestedQuantity = createCartDto.quantity || 1;
    const totalQuantity = (existingCartItem?.quantity ?? 0) + requestedQuantity;

    if (totalQuantity > book.stock) {
      throw new BadRequestException('Sepete eklemek istediğiniz miktar stoktan fazla.');
    }

    if (existingCartItem) {
      existingCartItem.quantity = totalQuantity;
      return await this.cartRepository.save(existingCartItem);
    }

    const newItem = this.cartRepository.create({
      user: { id: createCartDto.userId } as any,
      book: { id: createCartDto.bookId } as any,
      quantity: requestedQuantity,
    });
    return await this.cartRepository.save(newItem);
  }

  // Bir kullanıcının sepetindeki her şeyi getir
  async findByUser(userId: number) {
    return await this.cartRepository.find({
      where: { user: { id: userId } as any },
      relations: ['book'], // Kitap bilgilerini de beraberinde getir
    });
  }

  async remove(id: number) {
    const item = await this.cartRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Sepette bu ürün bulunamadı');
    }
    return await this.cartRepository.remove(item);
  }

  async checkout(userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cartItems = await queryRunner.manager.find(CartItem, {
        where: { user: { id: userId } as any },
        relations: ['book'],
      });

      if (cartItems.length === 0) {
        throw new BadRequestException('Sepetinizde satın alınacak ürün yok.');
      }

      const bookTotals = new Map<number, { book: Book; quantity: number }>();
      for (const item of cartItems) {
        if (!item.book) {
          throw new BadRequestException('Sepet öğesi için kitap bilgisi eksik.');
        }

        const existing = bookTotals.get(item.book.id);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          bookTotals.set(item.book.id, { book: item.book, quantity: item.quantity });
        }
      }

      const bookRepo = queryRunner.manager.getRepository(Book);
      for (const { book, quantity } of bookTotals.values()) {
        if (book.stock < quantity) {
          throw new BadRequestException(`${book.title} stokta yeterli değil.`);
        }

        book.stock -= quantity;
        book.salesCount += quantity;
        await bookRepo.save(book);
      }

      await queryRunner.manager.delete(CartItem, { user: { id: userId } as any });
      await queryRunner.commitTransaction();

      return { success: true, message: 'Satın alma işlemi tamamlandı.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Sepeti tamamen boşalt (Sıfırlama işlemi için lazım olacak)
  async clearAll() {
    return await this.cartRepository.delete({});
  }
}