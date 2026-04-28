import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import CustomerShop from './pages/CustomerShop';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/shop" element={<CustomerShop />} />
      {/* Yanlış adrese gidilirse Login'e at */}
      <Route path="*" element={<Navigate to="/" />} /> 
    </Routes>
  );
}