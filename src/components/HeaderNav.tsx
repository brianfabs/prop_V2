import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface HeaderNavProps {
  userName?: string;
  onLogout?: () => void;
}

const tabs = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/create-proposal', label: 'Create Proposal' },
  { path: '/admin', label: 'Admin' },
];

const HeaderNav: React.FC<HeaderNavProps> = ({ userName = 'User', onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <header className="w-full flex items-center justify-between bg-white px-8 border-b border-gray-200" style={{height: 'auto'}}>
      {/* Left: Empty for now (could add logo if needed) */}
      <div className="flex-1" />
      {/* Center: Tabs */}
      <nav className="flex flex-1 justify-center">
        <div className="flex gap-12 items-end">
          {tabs.map(tab => {
            const isActive = location.pathname === tab.path;
            return (
              <div key={tab.path} className="relative flex flex-col items-center justify-end h-full">
                <Link
                  to={tab.path}
                  className={`inline-block text-base font-medium px-2 py-6 transition-colors ${isActive ? 'text-blue-700 font-bold' : 'text-gray-800 hover:text-blue-700'}`}
                  style={{lineHeight: '1.5'}}
                >
                  {tab.label}
                </Link>
                {isActive && (
                  <span
                    className="absolute left-0 right-0 bottom-0 border-b-2 border-blue-700"
                    style={{borderColor: '#1d4ed8'}}
                  />
                )}
              </div>
            );
          })}
        </div>
      </nav>
      {/* Right: User + Logout */}
      <div className="flex-1 flex items-center justify-end gap-4">
        <span className="font-medium text-base text-gray-800 whitespace-nowrap">{userName}</span>
        <button
          onClick={onLogout ? onLogout : () => navigate('/login')}
          className="bg-red-600 text-white px-5 py-2 rounded font-semibold text-base hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default HeaderNav; 