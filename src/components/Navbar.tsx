import React, { useState, useRef, useEffect } from 'react';
import {
  Bookmark,
  BookOpen,
  Menu,
  ChevronDown,
  User,
  LogOut,
  LogIn,
} from 'lucide-react';

interface NavbarProps {
  savedCount: number;
  onOpenHistory: () => void;
  onReset: () => void;
  hasActiveNote: boolean;
  onToggleSidebar?: () => void;
  onOpenProfile: () => void;
  currentUser?: { name: string; email: string } | null;
  onLogout?: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedCount,
  onOpenHistory,
  onReset,
  hasActiveNote,
  onToggleSidebar,
  onOpenProfile,
  currentUser,
  onLogout,
  onOpenLogin,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200 transition-all w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={onReset}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden cursor-pointer"
            title="Return to NoteTube home"
          >
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xs group-hover:bg-red-700 transition-colors">
              <svg
                className="w-4.5 h-4.5 fill-current ml-0.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-editorial text-2xl font-bold text-neutral-900 tracking-tight leading-none">
                  NoteTube
                </span>
              </div>
              <span className="text-xs font-medium text-neutral-500 mt-0.5 hidden sm:block">
                Video to Study Notes
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {hasActiveNote && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-300 rounded-full transition-all duration-200 shadow-2xs cursor-pointer btn-spring"
            >
              <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
              <span>New Video</span>
            </button>
          )}

          <button
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-mono font-semibold text-neutral-900 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-full transition-all duration-200 shadow-2xs cursor-pointer btn-spring"
            title="Open saved study notes"
          >
            <Bookmark className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden xs:inline">History</span>
            {savedCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-4 h-4 px-1.5 text-[10px] font-bold leading-none text-white bg-neutral-900 rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1 pr-3 bg-neutral-100 hover:bg-neutral-200/90 rounded-full border border-neutral-300 transition-all duration-200 cursor-pointer shadow-2xs group btn-spring"
                  title="User menu"
                >
                  <div className="w-6.5 h-6.5 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                    {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AC'}
                  </div>
                  <span className="text-xs font-semibold text-neutral-800 hidden sm:inline">
                    {currentUser.name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-300 ${
                      isDropdownOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-68 bg-white border border-neutral-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                    <div className="px-3.5 py-2.5 border-b border-neutral-100 rounded-xl bg-neutral-50 mb-1">
                      <p className="text-xs font-bold text-neutral-900">{currentUser.name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {currentUser.email}
                      </p>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenProfile();
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-neutral-500" />
                        <span>User Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenHistory();
                        }}
                        className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Bookmark className="w-3.5 h-3.5 text-red-600" />
                          <span>Saved Notes</span>
                        </div>
                        <span className="text-xs text-neutral-400">
                          {savedCount}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-full transition-all duration-200 cursor-pointer btn-spring"
                  title="Sign out of account"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span className="hidden xs:inline">Log Out</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 border border-red-700 rounded-full shadow-xs transition-all duration-200 cursor-pointer btn-spring"
              title="Sign in or register"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
