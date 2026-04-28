import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';

@Entity('cart')
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  // ManyToOne: Çok sayıda sepet öğesi bir kullanıcıya ait olabilir
  @ManyToOne(() => User)
  user!: User;

  // ManyToOne: Çok sayıda sepet öğesi aynı kitabı işaret edebilir
  @ManyToOne(() => Book)
  book!: Book;

  @Column({ default: 1 })
  quantity!: number;
}