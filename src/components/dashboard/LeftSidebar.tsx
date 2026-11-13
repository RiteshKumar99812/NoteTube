import React, { useState } from 'react';
import {
  Compass,
  Bookmark,
  HelpCircle,
  Clock,
  Sliders,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  PlusCircle,
  Settings,
  ShieldCheck,
  LogOut,
  LogIn,
} from 'lucide-react';
import type { SavedNoteRecord } from '../../types/notes';

interface LeftSidebarProps {
  activeTab: 'workspace' | 'library' | 'quiz' | 'timestamps';
  setActiveTab: (tab: 'workspace' | 'library' | 'quiz' | 'timestamps') => void;
  savedNotes: SavedNoteRecord[];
  activeVideoId?: string;
  onSelectNote: (note: SavedNoteRecord) => void;
  onNewVideo: () => void;
  synthesisMode: 'academic' | 'executive' | 'revision';
  setSynthesisMode: (mode: 'academic' | 'executive' | 'revision') => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenProfile: () => void;
  tabFont?: 'normal' | 'cursive';
  currentUser?: { name: string; email: string } | null;
  onLogout?: () => void;
  onOpenLogin?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeTab,
  setActiveTab,
  savedNotes,
  activeVideoId,
  onSelectNote,
  onNewVideo,
  synthesisMode,
  setSynthesisMode,
  isOpenMobile,
  onCloseMobile,
  onOpenProfile,
  tabFont = 'normal',
  currentUser,
  onLogout,
  onOpenLogin,
}) => {
  const [isDepthOpen, setIsDepthOpen] = useState(true);
  const [isRecentOpen, setIsRecentOpen] = useState(true);

  const fontClass = tabFont === 'cursive' ? 'tab-font-cursive' : 'tab-font-normal';

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-neutral-900/40 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-white border-r border-neutral-200 flex flex-col z-40 transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } shrink-0 shadow-xs`}
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <button
            onClick={() => {
              onNewVideo();
              onCloseMobile();
            }}
            className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold tracking-wider uppercase shadow-xs transition-all duration-200 cursor-pointer btn-spring ${fontClass}`}
          >
            <PlusCircle className="w-4 h-4 text-red-500" />
            <span>+ New Note</span>
          </button>

          <div className="space-y-1.5">
            <p className="text-xs uppercase tracking-wider text-neutral-500 px-2 mb-2 font-bold font-sans">
              Navigation
            </p>

            <button
              onClick={() => {
                setActiveTab('workspace');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer tab-nudge ${fontClass} ${
                activeTab === 'workspace'
                  ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/30'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className={`w-4.5 h-4.5 ${activeTab === 'workspace' ? 'text-white' : 'text-red-600'}`} />
                <span className="text-[14px]">Workspace</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab('library');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer tab-nudge ${fontClass} ${
                activeTab === 'library'
                  ? 'bg-[#0F766E] text-white font-bold shadow-md shadow-teal-700/30'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bookmark className={`w-4.5 h-4.5 ${activeTab === 'library' ? 'text-white' : 'text-[#0F766E]'}`} />
                <span className="text-[14px]">Saved Notes</span>
              </div>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                activeTab === 'library'
                  ? 'bg-white/25 text-white border-white/30'
                  : 'bg-white text-neutral-800 border-neutral-200 shadow-2xs'
              }`}>
                {savedNotes.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('quiz');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer tab-nudge ${fontClass} ${
                activeTab === 'quiz'
                  ? 'bg-[#D97706] text-white font-bold shadow-md shadow-amber-600/30'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <HelpCircle className={`w-4.5 h-4.5 ${activeTab === 'quiz' ? 'text-white' : 'text-[#D97706]'}`} />
                <span className="text-[14px]">Practice Quiz</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab('timestamps');
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer tab-nudge ${fontClass} ${
                activeTab === 'timestamps'
                  ? 'bg-[#1E293B] text-white font-bold shadow-md shadow-slate-900/30'
                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className={`w-4.5 h-4.5 ${activeTab === 'timestamps' ? 'text-white' : 'text-slate-700'}`} />
                <span className="text-[14px]">Timestamps</span>
              </div>
            </button>
          </div>

          <div className="pt-2 border-t border-neutral-200">
            <button
              onClick={() => setIsDepthOpen(!isDepthOpen)}
              className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer rounded-lg hover:bg-neutral-50"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-neutral-500" />
                <span className={fontClass}>Note Detail</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${
                  isDepthOpen ? 'transform rotate-0' : 'transform -rotate-90'
                }`}
              />
            </button>

            {isDepthOpen && (
              <div className="space-y-2 mt-2 animate-in fade-in slide-in-from-top-1 duration-250">
                {[
                  {
                    id: 'academic',
                    label: 'Detailed Notes',
                    desc: 'Full breakdown & timestamps',
                    activeColor: 'bg-red-50 border-red-600 text-red-950 shadow-xs',
                    badgeColor: 'bg-red-600 text-white',
                  },
                  {
                    id: 'executive',
                    label: 'Quick Summary',
                    desc: 'Key takeaways & brief recap',
                    activeColor: 'bg-teal-50 border-[#0F766E] text-teal-950 shadow-xs',
                    badgeColor: 'bg-[#0F766E] text-white',
                  },
                  {
                    id: 'revision',
                    label: 'Practice Quiz',
                    desc: 'Practice questions & terms',
                    activeColor: 'bg-amber-50 border-[#D97706] text-amber-950 shadow-xs',
                    badgeColor: 'bg-[#D97706] text-white',
                  },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSynthesisMode(m.id as any)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer tab-nudge border ${
                      synthesisMode === m.id
                        ? `${m.activeColor} border-2 font-bold`
                        : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${fontClass}`}>
                        {m.label}
                      </span>
                      {synthesisMode === m.id && (
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${m.badgeColor}`}>
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{m.desc}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-neutral-200">
            <button
              onClick={() => setIsRecentOpen(!isRecentOpen)}
              className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer rounded-lg hover:bg-neutral-50"
            >
              <div className="flex items-center gap-2">
                <FolderOpen className="w-3.5 h-3.5 text-neutral-500" />
                <span className={fontClass}>Recent Notes</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${
                  isRecentOpen ? 'transform rotate-0' : 'transform -rotate-90'
                }`}
              />
            </button>

            {isRecentOpen && (
              <div className="space-y-1.5 mt-2 animate-in fade-in slide-in-from-top-1 duration-250">
                {savedNotes.length === 0 ? (
                  <p className="text-xs text-neutral-400 px-2.5 py-1">No notes saved.</p>
                ) : (
                  savedNotes.slice(0, 4).map((item) => {
                    const isCurrent = activeVideoId === item.videoId;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectNote(item);
                          onCloseMobile();
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all duration-200 text-sm group cursor-pointer tab-nudge border ${
                          isCurrent
                            ? 'bg-[#1E293B] font-bold text-white border-slate-900 shadow-sm shadow-slate-900/20'
                            : 'bg-neutral-50/70 text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className={`truncate flex-1 font-sans text-sm ${fontClass} ${isCurrent ? 'text-white' : 'text-neutral-900'}`}>
                            {item.notes.title}
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0 ${
                            isCurrent ? 'text-red-400' : 'text-neutral-400 group-hover:text-neutral-700'
                          }`} />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isCurrent ? 'bg-red-600 text-white' : 'bg-neutral-200 text-neutral-700'
                          }`}>
                            ID: {item.videoId}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-3.5 border-t border-neutral-300 bg-white">
          {currentUser ? (
            <div className="space-y-2">
              <button
                onClick={() => {
                  onOpenProfile();
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-neutral-100 transition-all duration-200 cursor-pointer text-left group card-interactive border border-neutral-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AC'}
                  </div>
                  <div className="min-w-0">
                    <span className={`text-sm font-bold text-neutral-900 truncate block ${fontClass}`}>
                      {currentUser.name}
                    </span>
                    <span className="text-xs text-neutral-500 truncate block">
                      {currentUser.email || 'Scholar Pro'}
                    </span>
                  </div>
                </div>
                <Settings className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 shrink-0" />
              </button>

              {onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    onCloseMobile();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-all duration-200 cursor-pointer shadow-2xs btn-spring"
                  title="Sign out of account"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-600" />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenLogin?.();
                onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 border border-red-700 transition-all duration-200 cursor-pointer shadow-xs btn-spring"
              title="Sign in to account"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>
          )}
        </div>

        <div className="p-3 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <div className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
              <span className={fontClass}>Local Vault</span>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Active
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
