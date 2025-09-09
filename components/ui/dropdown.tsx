import * as React from 'react';

export interface DropdownProps {
  label: React.ReactNode;
  children: React.ReactNode;
}

export function Dropdown({ label, children }: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
}

export interface DropdownItemProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export function DropdownItem({ onClick, children }: DropdownItemProps) {
  return (
    <button
      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
