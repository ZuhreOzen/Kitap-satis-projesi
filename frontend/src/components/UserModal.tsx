import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { type User } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, isUpdate: boolean, id?: number) => Promise<void>;
  initialData: User | null;
}

export default function UserModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [form, setForm] = useState({ username: '', password: '' });

  useEffect(() => {
    if (initialData) {
      setForm({ username: initialData.username, password: '' });
    } else {
      setForm({ username: '', password: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (initialData) {
      const updateData: any = { username: form.username };
      if (form.password) updateData.password = form.password;
      await onSubmit(updateData, true, initialData.id);
    } else {
      await onSubmit(form, false);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{initialData ? 'Müşteriyi Güncelle' : 'Yeni Müşteri Ekle'}</h2>
          <button className="modal-close" onClick={onClose}><X /></button>
        </div>

        <div className="form-group">
          <input className="modern-input" placeholder="Kullanıcı Adı" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          <input className="modern-input" type="password" placeholder={initialData ? 'Yeni Şifre (boş bırakılabilir)' : 'Şifre Belirle'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <button className="btn btn-secondary" onClick={handleSubmit}>
            {initialData ? 'Kaydet' : 'Müşteriyi Oluştur'}
          </button>
        </div>
      </div>
    </div>
  );
}
