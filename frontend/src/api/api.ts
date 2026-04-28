import axios from 'axios';

const client = axios.create({ baseURL: 'http://localhost:3000' });

export const api = {
  // Auth & Kullanıcılar
  login: (data: any) => client.post('/auth/login', data),
  register: (data: any) => client.post('/auth/register', data), // Admin müşteri eklerken bunu kullanacak
  getUsers: () => client.get('/users'),
  deleteUser: (id: number) => client.delete(`/users/${id}`),
  updateUser: (id: number, data: any) => client.patch(`/users/${id}`, data),
  
  // Kitaplar
  getBooks: () => client.get('/books'),
  createBook: (data: any) => client.post('/books', data),
  updateBook: (id: number, data: any) => client.patch(`/books/${id}`, data),
  deleteBook: (id: number) => client.delete(`/books/${id}`),
  
  // Sepet & Demo (Sıfırlama)
  addToCart: (data: any) => client.post('/cart', data),
  checkout: (userId: number) => client.post('/cart/checkout', { userId }),
  getCart: (userId: number) => client.get(`/cart/user/${userId}`),
  removeFromCart: (itemId: number) => client.delete(`/cart/${itemId}`),
  resetSystem: () => client.post('/demo/reset')
};