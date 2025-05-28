import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  userName?: string;
  onLogout?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ userName = 'Brian', onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white flex items-center justify-between px-8" style={{ minHeight: 90 }}>
      {/* Left: Logo */}
      <div className="flex items-center min-w-0">
        <span className="text-2xl font-bold text-blue-900 whitespace-nowrap">Global Roofing</span>
      </div>
      {/* Right: User + Logout */}
      <div className="flex items-center gap-4 min-w-0">
        <span className="font-medium text-xl text-gray-700 whitespace-nowrap">{userName}</span>
        <button
          onClick={onLogout ? onLogout : () => navigate('/login')}
          className="bg-red-600 text-white px-8 py-3 rounded-md font-semibold text-xl hover:bg-red-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar; 