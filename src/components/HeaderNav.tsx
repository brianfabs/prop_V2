import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/global-roofing-logo.svg';
import { motion } from 'framer-motion';

interface HeaderNavProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
  className?: string;
}

const tabs = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/create-proposal', label: 'Create Proposal' },
  { path: '/admin', label: 'Admin' },
];

const HeaderNav: React.FC<HeaderNavProps> = ({ userName = 'User', userEmail = '', onLogout, className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{top: number, left: number} | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [underlineProps, setUnderlineProps] = useState({ left: 0, width: 0, ready: false });
  const [scaleX, setScaleX] = useState(0);

  // Calculate dropdown position
  const calculateDropdownPos = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const top = rect.bottom + 6;
      const left = rect.right - 180; // 180px menu width
      setDropdownPos({ top, left });
    }
  };

  // Open menu and set dropdown position
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  // Recalculate position on open, scroll, and resize
  useEffect(() => {
    if (open) {
      calculateDropdownPos();
      window.addEventListener('scroll', calculateDropdownPos, true);
      window.addEventListener('resize', calculateDropdownPos);
      return () => {
        window.removeEventListener('scroll', calculateDropdownPos, true);
        window.removeEventListener('resize', calculateDropdownPos);
      };
    }
  }, [open]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Underline animation: always set left/width instantly, animate scaleX from 0 to 1 from center
  useEffect(() => {
    const activeIdx = tabs.findIndex(tab =>
      tab.path === '/admin'
        ? location.pathname.startsWith('/admin')
        : location.pathname === tab.path
    );
    const activeTab = tabRefs.current[activeIdx];
    if (activeTab) {
      const rect = activeTab.getBoundingClientRect();
      const parentRect = activeTab.parentElement?.getBoundingClientRect();
      const left = rect.left - (parentRect?.left || 0);
      const width = rect.width;
      setUnderlineProps({ left, width, ready: true });
      setScaleX(0);
      setTimeout(() => setScaleX(1), 20);
    }
  }, [location.pathname]);

  // Helper to get first and last name
  const getFirstAndLast = (name: string) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    return parts[0] + ' ' + parts[parts.length - 1];
  };

  // Helper to get first letter of name or email
  const getFirstLetter = (name: string, email?: string) => {
    if (name && name.trim() !== '') {
      const parts = name.trim().split(/\s+/);
      if (parts[0] && parts[0][0]) return parts[0][0].toUpperCase();
    }
    if (email && email.trim() !== '') {
      return email.trim()[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <header className={`flex items-center bg-[rgba(49,60,60,0.7)] backdrop-blur-md px-4 border-b border-primary border-opacity-20 ${className}`}>
      {/* Logo */}
      <div className="flex items-center min-w-0">
        <img src="/global-roofing-logo.png" alt="Global Roofing Logo" className="mr-4" style={{ height: 32, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} />
      </div>
      {/* Tabs */}
      <nav className="flex-1 flex items-end justify-center relative">
        <div className="flex gap-2 items-end relative">
          {/* Animated Material Design underline */}
          <motion.span
            layout
            className="absolute bottom-0 h-[4px] bg-white rounded-[1px] z-10"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              left: underlineProps.left,
              width: underlineProps.width,
              opacity: 1,
              scaleX: scaleX,
            }}
            transition={{
              left: { type: 'spring', stiffness: 400, damping: 30 },
              width: { type: 'spring', stiffness: 400, damping: 30 },
              opacity: { duration: 0.2 },
              scaleX: { duration: 0.25 },
            }}
            style={{ left: underlineProps.left, width: underlineProps.width, opacity: underlineProps.ready ? 1 : 0, transformOrigin: '50% 50%' }}
          />
          {tabs.map((tab, idx) => {
            let isActive = false;
            if (tab.path === '/admin') {
              isActive = location.pathname.startsWith('/admin');
            } else {
              isActive = location.pathname === tab.path;
            }
            return (
              <div
                key={tab.path}
                className="relative flex flex-col items-center justify-end h-full"
                ref={el => (tabRefs.current[idx] = el)}
              >
                <Link
                  to={tab.path}
                  className={`inline-block ${isActive ? 'text-md font-medium text-white hover:text-white' : 'text-base font-medium text-white/80 hover:text-white'} px-2 transition-colors`}
                  style={{ lineHeight: '1.5', paddingTop: 24, paddingBottom: 24 }}
                >
                  {tab.label}
                </Link>
              </div>
            );
          })}
        </div>
      </nav>
      {/* User Profile Dropdown */}
      <div className="flex items-center gap-4 ml-[133px]">
        <div className="relative inline-block">
          <button
            ref={btnRef}
            className="p-1 rounded border border-[#a5a17b] bg-[#a5a17b] flex items-center justify-center transition-colors focus:outline-none hover:border-[#bdb98d] hover:bg-[#bdb98d]"
            onClick={handleButtonClick}
            aria-label="User menu"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-3.3137 3.134-6 8-6s8 2.6863 8 6" />
            </svg>
          </button>
          {open && dropdownPos && (
            <div
              ref={dropdownRef}
              className="z-[99999] pointer-events-auto bg-white rounded shadow-lg border border-gray-200 py-1 min-w-max"
              style={{
                position: 'absolute',
                top: 44,
                right: 0,
              }}
            >
              <div className="px-3 py-1.5 text-gray-900 font-semibold text-[14px] whitespace-nowrap">{getFirstAndLast(userName)}</div>
              {userEmail && (
                <div className="px-3 pb-1 text-gray-500 text-xs whitespace-nowrap">{userEmail}</div>
              )}
              <div className="my-1 border-t border-gray-100" />
              <button
                onClick={onLogout ? onLogout : () => navigate('/login')}
                className="block w-full text-left px-3 py-1.5 text-[14px] text-gray-700 hover:text-primary focus:text-primary active:text-primary visited:text-primary hover:bg-gray-100 rounded-none font-medium focus:outline-none border-none bg-transparent hover:border-none no-underline transition-colors duration-200 ease-in-out"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderNav; 