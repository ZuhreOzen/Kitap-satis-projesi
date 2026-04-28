import React, { useState } from 'react';
import { api } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await api.login(form);
        localStorage.setItem('user', JSON.stringify(res.data));
        navigate(res.data.role === 'ADMIN' ? '/admin' : '/shop');
      } else {
        await api.register(form);
        alert('Kayıt başarılı! Lütfen giriş yapın.');
        setIsLogin(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Bir hata oluştu.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{isLogin ? 'Mağazaya Giriş' : 'Kayıt Ol'}</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            required
            type="text"
            placeholder="Kullanıcı Adı"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            className="modern-input"
          />
          <input
            required
            type="password"
            placeholder="Şifre"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="modern-input"
          />
          <button type="submit" className={isLogin ? 'btn btn-primary' : 'btn btn-secondary'}>
            {isLogin ? <><LogIn size={18} /> Giriş Yap</> : <><UserPlus size={18} /> Kayıt Ol</>}
          </button>
        </form>

        <p className="auth-switch" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Hesabın yok mu? Kayıt ol.' : 'Zaten üye misin? Giriş yap.'}
        </p>
      </div>
    </div>
  );
}
