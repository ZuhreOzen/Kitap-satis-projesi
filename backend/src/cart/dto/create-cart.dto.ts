export class CreateCartDto {
  userId!: number;
  bookId!: number;
  quantity?: number; // Opsiyonel, gönderilmezse varsayılan 1 olur
}