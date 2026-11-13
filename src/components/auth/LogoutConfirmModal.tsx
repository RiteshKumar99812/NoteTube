import React, { useEffect } from 'react';
import { LogOut, X } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0 shadow-2xs">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-editorial text-xl font-bold text-neutral-900 leading-tight">
              Log Out of NoteTube?
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Confirm your sign out request
            </p>
          </div>
        </div>

        <p className="text-sm text-neutral-600 leading-relaxed font-sans mb-6">
          Are you sure you want to log out of your session? You will be returned to the front login page. Any notes generated will remain saved in your browser vault.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-all cursor-pointer btn-spring"
          >
            Stay Logged In
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 border border-red-700 shadow-md shadow-red-600/30 transition-all cursor-pointer btn-spring"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Yes, Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

