import React from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full z-50 transition-transform duration-500 ease-in-out bg-gray-100 border-l border-gray-100`}
      style={{
        width: '33.333vw',
        minWidth: 320,
        maxWidth: 480,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      }}
    >
      <button
        className="absolute top-4 right-4 flex items-center justify-center bg-primary hover:bg-primary-dark text-white transition-colors focus:outline-none"
        onClick={onClose}
        aria-label="Close Drawer"
        style={{ width: 40, height: 40, padding: 0, borderRadius: 10 }}
      >
        <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="p-6 overflow-y-auto h-full pt-16">{children}</div>
    </div>
  );
};

export default Drawer; 