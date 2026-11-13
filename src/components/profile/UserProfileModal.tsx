import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  Save,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedNotesCount: number;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  savedNotesCount,
}) => {
  const [name, setName] = useState('Alex Chen');
  const [role, setRole] = useState('Computer Science & AI Researcher');
  const [institution, setInstitution] = useState('Stanford University / Self-Learner');
  const [defaultExport, setDefaultExport] = useState<'pdf' | 'md'>('pdf');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-neutral-900/40 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative bg-white border border-neutral-200 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-5 border-b border-neutral-200">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-neutral-900 text-white font-bold text-sm flex items-center justify-center shadow-xs">
              AC
            </div>
            <div>
              <h3 className="font-editorial text-2xl font-bold text-neutral-900 leading-tight">
                {name}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Researcher & Learner
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5 my-6 text-center">
          <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
            <BookOpen className="w-4 h-4 text-red-600 mx-auto mb-1" />
            <span className="text-lg font-bold text-neutral-900 block leading-tight">
              {savedNotesCount}
            </span>
            <span className="text-xs text-neutral-500 block mt-0.5">
              Saved Notes
            </span>
          </div>

          <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
            <Clock className="w-4 h-4 text-[#0F766E] mx-auto mb-1" />
            <span className="text-lg font-bold text-neutral-900 block leading-tight">
              {savedNotesCount * 14} min
            </span>
            <span className="text-xs text-neutral-500 block mt-0.5">
              Study Time
            </span>
          </div>

          <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
            <Award className="w-4 h-4 text-[#D97706] mx-auto mb-1" />
            <span className="text-lg font-bold font-mono text-neutral-900 block leading-tight">
              {savedNotesCount * 4}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block mt-0.5">
              Recall Quizzes
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-neutral-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full border border-neutral-300 focus:border-neutral-900 focus:outline-hidden text-sm font-sans"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
              Focus Area / Specialization
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full border border-neutral-300 focus:border-neutral-900 focus:outline-hidden text-sm font-sans"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
              Affiliation or Institution
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full border border-neutral-300 focus:border-neutral-900 focus:outline-hidden text-sm font-sans"
            />
          </div>

          <div>
            <label className="block text-neutral-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
              Default One-Click Export
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDefaultExport('pdf')}
                className={`flex-1 py-2.5 rounded-full border font-bold transition-all cursor-pointer ${
                  defaultExport === 'pdf'
                    ? 'bg-red-600 text-white border-red-700 shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-300'
                }`}
              >
                Formatted PDF
              </button>
              <button
                type="button"
                onClick={() => setDefaultExport('md')}
                className={`flex-1 py-2.5 rounded-full border font-bold transition-all cursor-pointer ${
                  defaultExport === 'md'
                    ? 'bg-[#1E293B] text-white border-slate-900 shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-300'
                }`}
              >
                Markdown (.md)
              </button>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-neutral-200">
            <span className="text-[11px] text-neutral-400">
              Settings stored locally
            </span>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold transition-all cursor-pointer btn-spring shadow-xs"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
