import Swal from 'sweetalert2';
import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/api';
import { type Book, type User } from '../types';
import { useNavigate } from 'react-router-dom';

interface StoredUser {
  userId?: number;
  role?: string;
}

const getCurrentUser = (): StoredUser => {
  return JSON.parse(localStorage.getItem('user') || '{}');
};

export const useAdmin = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
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

  const loadCustomers = useCallback(async () => {
    try {
      const response = await api.getUsers();
      setCustomers(response.data.filter((user: User) => user.id !== currentUser.userId));
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata oluştu', error);
    }
  }, [currentUser.userId]);

  const loadData = useCallback(async () => {
    await Promise.all([loadBooks(), loadCustomers()]);
  }, [loadBooks, loadCustomers]);

  useEffect(() => {
    if (!currentUser.userId || currentUser.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    void loadData();
  }, [currentUser.role, currentUser.userId, loadData, navigate]);

  const deleteBook = async (id: number) => {
    await api.deleteBook(id);
    await loadBooks();
  };

  const deleteCustomer = async (id: number) => {
    await api.deleteUser(id);
    await loadCustomers();
  };

  const submitUser = async (formData: any, isUpdate: boolean, id?: number) => {
    try {
      if (isUpdate && id) {
        await api.updateUser(id, formData);
      } else {
        await api.register(formData);
      }
      await loadCustomers();
    } catch (error) {
      console.error('Kullanıcı işlemi başarısız', error);
    }
  };

  const resetSystem = async () => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: 'Sistem orijinal Golden State haline dönecek!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--danger)',
      cancelButtonColor: '#333',
      confirmButtonText: 'Evet, Sıfırla!',
      cancelButtonText: 'İptal',
      background: 'var(--surface-color)',
      color: 'var(--text-primary)'
    });

    if (!result.isConfirmed) {
      return;
    }

    await api.resetSystem();
    await loadData();

    await Swal.fire({
      title: 'Sıfırlandı!',
      text: 'Sistem başarıyla ilk haline döndü.',
      icon: 'success',
      background: 'var(--surface-color)',
      color: 'var(--text-primary)',
      confirmButtonColor: 'var(--primary-color)'
    });
  };

  return { books, customers, loadData, deleteBook, deleteCustomer, resetSystem, submitUser };
};