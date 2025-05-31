import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  userName?: string;
  onLogout?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ userName = 'Brian', onLogout }) => {
  const navigate = useNavigate();
  const firstInitial = userName.charAt(0).toUpperCase();

  return (
    <nav className="fixed top-0 left-0 w-full z-[9999] bg-white/70 backdrop-blur-md border-b-4 border-red-500 flex items-center justify-between px-8" style={{ minHeight: 90 }}>
      {/* Left: Logo */}
      <div className="flex items-center min-w-0">
        <span className="text-2xl font-bold text-primary whitespace-nowrap">Global Roofing</span>
      </div>
      {/* Right: User + Logout */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-white text-primary flex items-center justify-center font-semibold border border-gray-200">
            {firstInitial}
          </div>
          <span className="font-medium text-xl text-gray-700 whitespace-nowrap">{userName}</span>
        </div>
        <button
          onClick={onLogout ? onLogout : () => navigate('/login')}
          className="btn-primary"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar; 