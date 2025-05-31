import React from 'react';
import HeaderNav from './HeaderNav';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

const NAVBAR_HEIGHT = 72;

const AdminLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-white">
    {/* Fixed HeaderNav */}
    <div className="fixed top-0 left-0 w-full z-50">
      <HeaderNav />
    </div>
    {/* Sidebar as overlay */}
    <AdminSidebar />
    {/* Main Content Group (with top padding for header) */}
    <div className="flex flex-1 min-h-0 w-full pt-[72px]">
      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-[1000px] py-8">
          <Outlet />
        </div>
      </main>
    </div>
  </div>
);

export default AdminLayout; 