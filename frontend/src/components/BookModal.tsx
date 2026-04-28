import { useState, useEffect, type ChangeEvent } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { api } from '../api/api';
import { type Book } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: Book | null;
}

interface BookForm {
  title: string;
  author: string;
  price: string;
  coverUrl: string;
  stock: string;
  salesCount: string;
}

const createFormState = (book: Book | null): BookForm => ({
  title: book?.title ?? '',
  author: book?.author ?? '',
  price: book?.price != null ? String(book.price) : '',
  coverUrl: book?.coverUrl ?? '',
  stock: book?.stock != null ? String(book.stock) : '',
  salesCount: book?.salesCount != null ? String(book.salesCount) : '0',
});

const buildPayload = (form: BookForm) => ({
  title: form.title,
  author: form.author,
  price: Number(form.price || 0),
  coverUrl: form.coverUrl,
  stock: Number(form.stock || 0),
  salesCount: Number(form.salesCount || 0),
});

export default function BookModal({ isOpen, onClose, onSuccess, initialData }: Props) {
  const [form, setForm] = useState<BookForm>(createFormState(null));
  const isEditing = Boolean(initialData);

  useEffect(() => {
    setForm(createFormState(initialData));
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof BookForm, value: string) => {
    setForm(prevForm => ({
      ...prevForm,
      [field]: value,
    } as BookForm));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prevForm => ({ ...prevForm, coverUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const payload = buildPayload(form);

    if (isEditing && initialData) {
      await api.updateBook(initialData.id, payload);
    } else {
      await api.createBook(payload);
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? 'Kitabı Güncelle' : 'Yeni Kitap Ekle'}</h2>
          <button className="modal-close" onClick={onClose}><X /></button>
        </div>

        <div className="form-group">
          <input
            className="modern-input"
            placeholder="Kitap Adı"
            value={form.title}
            onChange={e => handleInputChange('title', e.target.value)}
          />
          <input
            className="modern-input"
            placeholder="Yazar"
            value={form.author}
            onChange={e => handleInputChange('author', e.target.value)}
          />
          <input
            className="modern-input"
            type="number"
            placeholder="Fiyat (₺)"
            value={form.price || ''}
            onChange={e => handleInputChange('price', e.target.value)}
          />
          <input
            className="modern-input"
            type="number"
            placeholder="Stok Miktarı"
            min={0}
            value={form.stock}
            onChange={e => handleInputChange('stock', e.target.value)}
          />
          {isEditing && (
            <input
              className="modern-input"
              type="number"
              placeholder="Satış Sayısı"
              min={0}
              value={form.salesCount}
              onChange={e => handleInputChange('salesCount', e.target.value)}
            />
          )}

          <div className="upload-card">
            <UploadCloud color="var(--primary-color)" size={30} style={{ marginBottom: '10px' }} />
            <div>{form.coverUrl ? '✓ Resim seçildi. Değiştirmek için tıklayın.' : 'PC’den kapak resmi seçin'}</div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>

          {form.coverUrl && <img className="upload-preview" src={form.coverUrl} alt="Önizleme" />}

          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEditing ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}
