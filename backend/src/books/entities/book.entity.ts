import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  author!: string;

  // Fiyatlar para birimi olduğu için küsuratlı (decimal) olmalıdır
  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'text', nullable: true })
  coverUrl?: string;

  @Column({ default: 0 }) // Başlangıç satış sayısı 0'dır
  salesCount!: number;

  @Column('int', { default: 0 }) // Stok miktarı yoksa 0 olarak başlar
  stock!: number;
}