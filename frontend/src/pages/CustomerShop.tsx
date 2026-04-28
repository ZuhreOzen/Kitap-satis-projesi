import { useState } from 'react';
import { useCustomer } from '../hooks/useCustomer';
import { ShoppingCart, LogOut, X, Trash2, Image as ImageIcon, BookOpen, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerShop() {
  const { user, books, cartItems, addToCart, removeFromCart, checkout } = useCustomer();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const getCartQuantity = (bookId: number) => {
    return cartItems.reduce((sum, item) => sum + (item.book?.id === bookId ? item.quantity : 0), 0);
  };

  const handleAddAndOpenCart = async (bookId: number) => {
    await addToCart(bookId);
    setIsCartOpen(true);
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h2 className="page-title">
            📚 Hoş Geldin, <span style={{ color: 'var(--primary-color)' }}>{user.username}</span>
          </h2>
          <p className="page-subtitle">Bugünün favori kitaplarını seç ve sepetini kolayca yönet.</p>
        </div>

        <div className="card-actions">
          <button className="btn btn-secondary" onClick={() => setIsCartOpen(!isCartOpen)}>
            <ShoppingCart size={18} /> Sepetim ({cartItems.length})
          </button>
          {user.role === 'ADMIN' && (
            <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
              <BookOpen size={18} /> Yöneticiye Dön
            </button>
          )}
          <button className="btn btn-danger" onClick={() => { localStorage.removeItem('user'); navigate('/'); }}>
            <LogOut /> Çıkış Yap
          </button>
        </div>
      </header>

      <div className="grid-cards">
        {books.map(book => (
          <article key={book.id} className="section-card section-card--compact" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {book.coverUrl ? (
              <img src={book.coverUrl} alt="kapak" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '18px' }} />
            ) : (
              <div style={{ height: '200px', background: '#232f3f', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5b6776' }}>
                <ImageIcon size={40} />
              </div>
            )}
            <div>
              <h3 style={{ margin: '0 0 8px 0' }}>{book.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{book.author}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ color: 'var(--secondary-color)', margin: '0' }}>₺{book.price}</h2>
              <span style={{ color: book.stock > 0 ? '#9fdb8e' : '#f16c6c', fontWeight: 700 }}>
                {book.stock > 0 ? `Stok: ${book.stock}` : 'Tükenmiş'}
              </span>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => handleAddAndOpenCart(book.id)}
              style={{ marginTop: 'auto' }}
              disabled={book.stock <= 0 || getCartQuantity(book.id) >= book.stock}
            >
              <ShoppingCart size={18} /> Sepete Ekle
            </button>
          </article>
        ))}
      </div>

      {isCartOpen && (
        <aside style={{ position: 'fixed', top: 0, right: 0, width: '380px', height: '100vh', background: 'var(--surface-color)', boxShadow: '-10px 0 30px rgba(0,0,0,0.8)', padding: '25px', zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>🛒 Sepetiniz</h2>
            <button className="action-btn" onClick={() => setIsCartOpen(false)} style={{ color: 'var(--text-secondary)' }}>
              <X size={24} />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Sepetiniz şu an boş.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ background: '#232f3f', padding: '18px', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{item.book?.title}</div>
                    <div style={{ color: 'var(--secondary-color)', marginTop: '6px' }}>
                      ₺{item.book?.price} <span style={{ color: '#8c99a6', fontSize: '0.85rem' }}>x{item.quantity}</span>
                    </div>
                  </div>
                  <button className="action-btn danger" onClick={() => removeFromCart(item.id)} style={{ background: 'rgba(242, 143, 123, 0.12)', borderRadius: '12px' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'right' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
                  Toplam: ₺{cartItems.reduce((acc, item) => acc + ((item.book?.price ?? 0) * item.quantity), 0).toFixed(2)}
                </h3>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    try {
                      await checkout();
                      setIsCartOpen(false);
                      alert('Satın alma işlemi başarıyla tamamlandı.');
                    } catch (error: any) {
                      alert(error.response?.data?.message || 'Satın alma sırasında bir hata oluştu.');
                    }
                  }}
                  style={{ marginTop: '16px', width: '100%' }}
                  disabled={cartItems.length === 0}
                >
                  <CreditCard size={18} /> Satın Al
                </button>
              </div>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
