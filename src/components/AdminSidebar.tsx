import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const sidebarLinks = [
  { 
    label: 'Overview', 
    path: '/admin',
    icon: (
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
      </svg>
    )
  },
  { 
    label: 'Users', 
    path: '/admin/user-management',
    icon: (
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 010 7.75" />
      </svg>
    )
  },
  { 
    label: 'Content', 
    path: '/admin/content-management',
    icon: (
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3" />
      </svg>
    )
  },
  { 
    label: 'Loan Options', 
    path: '/admin/loan-options',
    icon: (
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <path d="M2 10h20" />
      </svg>
    )
  }
];

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <aside
      className="fixed top-[72px] left-0 z-40 w-60 h-[calc(100vh-72px)] bg-gray-50 flex flex-col p-2"
      aria-label="Admin Sidebar"
    >
      {/* Sidebar Header */}
      <div className="mb-4 px-2 pt-2">
        <h2 className="text-xl font-medium text-primary-dark leading-tight">Admin Panel</h2>
        <p className="text-sm text-gray-500 mt-1">Manage users, content, and settings</p>
      </div>
      <nav className="flex flex-col gap-0.5">
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.label}
              type="button"
              className={`group flex items-center gap-1 p-2 rounded text-sm font-medium transition-colors text-left focus:outline-none border-0
                ${isActive ? 'bg-primary text-white font-bold hover:bg-primary-dark' : 'text-primary hover:bg-primary/5'}`}
              onClick={() => navigate(link.path)}
            >
              {React.cloneElement(link.icon, {
                className: `w-3 h-3 mr-1 ${isActive ? 'text-white' : 'text-primary group-hover:text-primary'}`,
              })}
              <span className={isActive ? '' : 'group-hover:text-primary'}>{link.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar; 