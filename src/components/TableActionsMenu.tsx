import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom';

interface TableActionsMenuProps {
  proposalId: string;
  onDelete: () => void;
  onEdit: (proposalId: string) => void;
  hideView?: boolean;
}

const DROPDOWN_WIDTH = 128;
const DROPDOWN_HEIGHT = 120;

const TableActionsMenu: React.FC<TableActionsMenuProps> = ({ proposalId, onDelete, onEdit, hideView }) => {
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
      // Align right edge of dropdown with right edge of button
      const left = rect.right - (dropdownRef.current?.offsetWidth || DROPDOWN_WIDTH);
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
        className="p-1 rounded border border-gray-200 bg-white flex items-center justify-center transition-colors focus:outline-none hover:border-primary"
        onClick={handleButtonClick}
        aria-label="Actions"
        type="button"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="4" cy="10" r="2" />
          <circle cx="10" cy="10" r="2" />
          <circle cx="16" cy="10" r="2" />
        </svg>
      </button>
      {open && dropdownPos && ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          className="z-[99999] pointer-events-auto bg-white shadow-lg rounded-md border border-gray-200 py-1 min-w-max flex flex-col transition-opacity duration-200 ease-in-out opacity-100"
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
          }}
        >
          {!hideView && (
            <Link
              to={`/proposal/${proposalId}`}
              className="w-full text-left px-3 py-1.5 text-[14px] text-gray-700 hover:text-primary hover:bg-gray-100 cursor-pointer rounded-none font-medium focus:outline-none border-none bg-transparent hover:border-none no-underline transition-colors duration-200 ease-in-out"
              role="menuitem"
              tabIndex={0}
              onClick={() => setOpen(false)}
            >
              View
            </Link>
          )}
          <button
            className="w-full text-left px-3 py-1.5 text-[14px] text-gray-700 hover:text-primary hover:bg-gray-100 cursor-pointer rounded-none font-medium focus:outline-none border-none bg-transparent hover:border-none transition-colors duration-200 ease-in-out"
            role="menuitem"
            tabIndex={0}
            onClick={() => { setOpen(false); onEdit(proposalId); }}
          >
            Edit
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button
            className="w-full text-left px-3 py-1.5 text-[14px] text-gray-700 hover:text-primary hover:bg-gray-100 cursor-pointer rounded-none font-medium focus:outline-none border-none bg-transparent hover:border-none transition-colors duration-200 ease-in-out"
            role="menuitem"
            tabIndex={0}
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