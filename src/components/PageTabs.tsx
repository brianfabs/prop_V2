import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/create-proposal', label: 'Create Proposal' },
  { path: '/admin', label: 'Admin' },
];

const PageTabs: React.FC = () => {
  const location = useLocation();
  return (
    <div className="w-full flex flex-col items-center mt-6 mb-10">
      <div className="flex gap-24 items-end">
        {tabs.map(tab => (
          <div key={tab.path} className="flex flex-col items-center">
            <Link
              to={tab.path}
              className={`text-2xl font-bold px-4 py-2 rounded transition-colors
                ${location.pathname === tab.path
                  ? 'bg-primary text-white'
                  : 'text-primary hover:bg-primary hover:text-white'}`}
              tabIndex={0}
            >
              {tab.label}
            </Link>
            {location.pathname === tab.path && (
              <div className="mt-2 w-20 h-3 rounded bg-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageTabs; 