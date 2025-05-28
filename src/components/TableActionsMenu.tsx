import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom';

interface TableActionsMenuProps {
  proposalId: string;
  onDelete: () => void;
}

const DROPDOWN_WIDTH = 128;
const DROPDOWN_HEIGHT = 120;

const TableActionsMenu: React.FC<TableActionsMenuProps> = ({ proposalId, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{top: number, left: number} | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Calculate dropdown position
  const calculateDropdownPos = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      let top = rect.bottom + 4;
      if (spaceBelow < DROPDOWN_HEIGHT && spaceAbove > DROPDOWN_HEIGHT) {
        top = rect.top - DROPDOWN_HEIGHT - 4;
      }
      const left = rect.right - DROPDOWN_WIDTH;
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

  return (
    <div className="relative inline-block">
      <button
        ref={btnRef}
        className="flex items-center justify-center rounded-[10px] hover:bg-gray-100 focus:outline-none p-3"
        style={{ width: 40, height: 40 }}
        onClick={handleButtonClick}
        aria-label="Actions"
        type="button"
      >
        <span style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="4" cy="10" r="2" />
            <circle cx="10" cy="10" r="2" />
            <circle cx="16" cy="10" r="2" />
          </svg>
        </span>
      </button>
      {open && dropdownPos && ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          className="z-[99999] pointer-events-auto bg-white rounded-[10px] shadow-lg border border-gray-200 py-1"
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: DROPDOWN_WIDTH,
            minWidth: DROPDOWN_WIDTH,
          }}
        >
          <Link
            to={`/proposal/${proposalId}`}
            className="block px-3 py-1.5 text-[14px] text-gray-900 hover:bg-gray-100 rounded-none"
            onClick={() => setOpen(false)}
          >
            View
          </Link>
          <Link
            to={`/edit-proposal/${proposalId}`}
            className="block px-3 py-1.5 text-[14px] text-gray-900 hover:bg-gray-100 rounded-none"
            onClick={() => setOpen(false)}
          >
            Edit
          </Link>
          <button
            className="block w-full text-left px-3 py-1.5 text-[14px] text-red-600 hover:bg-gray-100 rounded-none"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            Delete
          </button>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TableActionsMenu; 