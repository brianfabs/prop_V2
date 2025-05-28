import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <main className="w-screen min-h-screen flex flex-col bg-white items-center justify-center">
      <HeaderNav userName="Brian" onLogout={() => navigate('/login')} />
      <div className="bg-white rounded-xl shadow-lg p-8 mt-12 w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">Admin Dashboard</h1>
        <p className="text-gray-700 text-lg">Welcome to the admin panel.</p>
      </div>
    </main>
  );
};

export default AdminDashboard; 