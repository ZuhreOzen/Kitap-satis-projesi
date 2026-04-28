import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/api';
import { type Book } from '../types';
import { useNavigate } from 'react-router-dom';

interface StoredUser {
  userId?: number;
  username?: string;
  role?: string;
}

interface CartItem {
  id: number;
  quantity: number;
  book?: Book;
}

const getCurrentUser = (): StoredUser => {
  return JSON.parse(localStorage.getItem('user') || '{}');
};

export const useCustomer = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const loadBooks = useCallback(async () => {
    try {
      const response = await api.getBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Kitaplar yüklenirken hata oluştu', error);
    }
  }, []);

  const loadCart = useCallback(async () => {
    if (!currentUser.userId) return;
    try {
      const response = await api.getCart(currentUser.userId);
      setCartItems(response.data);
    } catch (error) {
      console.error('Sepet yüklenirken hata oluştu', error);
    }
  }, [currentUser.userId]);

  useEffect(() => {
    if (!currentUser.userId) {
      navigate('/');
      return;
    }

    void loadBooks();
    void loadCart();
  }, [currentUser.userId, loadBooks, loadCart, navigate]);

  const addToCart = async (bookId: number) => {
    if (!currentUser.userId) return;

    await api.addToCart({ userId: currentUser.userId, bookId, quantity: 1 });
    await loadCart();
  };

  const removeFromCart = async (itemId: number) => {
    await api.removeFromCart(itemId);
    await loadCart();
  };

  const checkout = async () => {
    if (!currentUser.userId) return;

    await api.checkout(currentUser.userId);
    await Promise.all([loadCart(), loadBooks()]);
  };

  return { user: currentUser, books, cartItems, addToCart, removeFromCart, checkout };
};