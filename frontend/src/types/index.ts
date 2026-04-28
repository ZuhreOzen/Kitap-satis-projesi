export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  coverUrl?: string;
  salesCount: number;
  stock: number;
}