import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom';
import IconButton from './IconButton';

interface TableActionsMenuProps {
  proposalId: string;
  onDelete: () => void;
}

const DROPDOWN_WIDTH = 128;

const TableActionsMenu: React.FC<TableActionsMenuProps> = ({ proposalId, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{top: number, left: number} | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Always recalculate position on open
  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const dropdownHeight = 120;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      let top = rect.bottom + window.scrollY + 4; // 4px below
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        top = rect.top + window.scrollY - dropdownHeight - 4; // 4px above
      }
      // Right align dropdown with button
      setDropdownPos({
        top,
        left: rect.right - DROPDOWN_WIDTH + window.scrollX,
      });
    }
  }, [open]);

  // Reset open state and position on unmount or route change
  useEffect(() => {
    setOpen(false);
    setDropdownPos(null);
  }, [location]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        btnRef.current && 
        !btnRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Handle escape key
  useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((v) => !v);
  };

  const dropdown = open && dropdownPos
    ? ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[9999] w-32 bg-white border border-gray-200 shadow-lg py-1"
          style={{ 
            top: dropdownPos.top,
            left: dropdownPos.left,
            minWidth: DROPDOWN_WIDTH,
            borderRadius: 10,
          }}
        >
          <Link
            to={`/proposal/${proposalId}`}
            className="w-full block text-left px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-900 text-sm focus:outline-none transition-colors"
            style={{ borderRadius: 0, border: 'none' }}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            View
          </Link>
          <Link
            to={`/edit-proposal/${proposalId}`}
            className="w-full block text-left px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-900 text-sm focus:outline-none transition-colors"
            style={{ borderRadius: 0, border: 'none' }}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            Edit
          </Link>
          <button
            className="w-full text-left px-3 py-1.5 bg-white hover:bg-gray-100 text-red-600 text-sm focus:outline-none transition-colors"
            style={{ borderRadius: 0, border: 'none' }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setOpen(false);
            }}
          >
            Delete
          </button>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="relative">
      <IconButton
        ref={btnRef}
        icon={
          <svg width={16} height={16} fill="currentColor" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        }
        ariaLabel="More actions"
        onClick={handleButtonClick}
      />
      {dropdown}
    </div>
  );
};

export default TableActionsMenu; 