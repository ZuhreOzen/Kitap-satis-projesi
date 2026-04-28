export class CreateBookDto {
  title!: string;
  author!: string;
  price!: number;
  coverUrl?: string; // Soru işareti (?) bu alanın zorunlu olmadığını belirtir
  stock?: number; // Kitabın stok durumu
  salesCount?: number; // Satış sayısını manuel olarak düzenlemek için
}