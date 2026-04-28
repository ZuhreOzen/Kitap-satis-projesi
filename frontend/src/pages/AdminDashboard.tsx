import { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import SalesBar from '../components/SalesBar';
import RevenueChart from '../components/RevenueChart';
import BookModal from '../components/BookModal';
import UserModal from '../components/UserModal';
import { RefreshCw, Trash2, Users, BookOpen, LogOut, Plus, Edit, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const { books, customers, loadData, deleteBook, deleteCustomer, resetSystem, submitUser } = useAdmin();
  const navigate = useNavigate();

  const [isBookModalOpen, setBookModalOpen] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);

  const openBookModal = (book: any = null) => {
    setEditingBook(book);
    setBookModalOpen(true);
  };

  const openUserModal = (user: any = null) => {
    setEditingUser(user);
    setUserModalOpen(true);
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-title">🛠️ Yönetim Paneli</h1>
          <p className="page-subtitle">Kitap envanterini, satış istatistiklerini ve kullanıcıları kolayca yönet.</p>
        </div>

        <div className="card-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/shop')}>
            <BookOpen size={18} /> Mağaza Görünümü
          </button>
          <button className="btn btn-primary" onClick={resetSystem}>
            <RefreshCw size={18} /> Sistemi Sıfırla
          </button>
          <button className="btn btn-danger" onClick={() => { localStorage.removeItem('user'); navigate('/'); }}>
            <LogOut size={18} /> Çıkış
          </button>
        </div>
      </header>

      {/* ORİJİNAL DÜZEN: Üstte Envanter (Sol) ve Kullanıcılar (Sağ) Yan Yana */}
      <div className="grid-2">
        
        {/* SOL: Kitap Envanteri */}
        <section className="section-card section-card--spacious">
          <div className="panel-header">
            <h3 className="panel-title"><BookOpen size={20} /> Kitap Envanteri</h3>
            <button className="btn btn-primary" onClick={() => openBookModal()}>
              <Plus size={16} /> Yeni Kitap
            </button>
          </div>

          <table className="inventory-table">
            <thead>
              <tr>
                <th>KİTAP</th>
                <th>FİYAT</th>
                <th>STOK</th>
                <th>SATIŞ</th>
                <th style={{ textAlign: 'right' }}>İŞLEMLER</th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b.id}>
                  <td style={{ padding: '15px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {b.coverUrl ? (
                      <img className="book-cover" src={b.coverUrl} alt="kapak" />
                    ) : (
                      <div className="cover-placeholder"><ImageIcon size={20} /></div>
                    )}
                    <div>
                      <strong>{b.title}</strong>
                      <small>{b.author}</small>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700 }}>₺{b.price}</td>
                  <td style={{ fontWeight: 700 }}>{b.stock}</td>
                  <td style={{ width: '150px' }}><SalesBar count={b.salesCount} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="action-btn" onClick={() => openBookModal(b)}>
                      <Edit size={18} />
                    </button>
                    <button className="action-btn danger" onClick={() => deleteBook(b.id)}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* SAĞ: Kullanıcılar */}
        <section className="section-card section-card--spacious">
          <div className="panel-header">
            <h3 className="panel-title"><Users size={20} /> Kullanıcılar</h3>
            <button className="btn btn-secondary" onClick={() => openUserModal()}>
              <Plus size={14} /> Ekle
            </button>
          </div>

          <div>
            {customers.map(u => (
              <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', alignItems: 'center' }}>
                <span>
                  <strong>{u.username}</strong>{' '}
                  <small style={{ color: u.role === 'ADMIN' ? 'var(--danger)' : 'var(--secondary-color)' }}>
                    ({u.role})
                  </small>
                </span>
                <div>
                  <button className="action-btn" onClick={() => openUserModal(u)}>
                    <Edit size={16} />
                  </button>
                  <button className="action-btn danger" onClick={() => deleteCustomer(u.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ALT: İnce Uzun Grafiğimiz */}
      <section style={{ maxWidth: '850px', margin: '40px auto 0' }}>
        <RevenueChart books={books} />
      </section>

      <BookModal isOpen={isBookModalOpen} onClose={() => setBookModalOpen(false)} onSuccess={loadData} initialData={editingBook} />
      <UserModal isOpen={isUserModalOpen} onClose={() => setUserModalOpen(false)} onSubmit={submitUser} initialData={editingUser} />
    </div>
  );
}

export default AdminDashboard;