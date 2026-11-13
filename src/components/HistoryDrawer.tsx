import React, { useEffect } from 'react';
import {
  X,
  Trash2,
  BookOpen,
  Calendar,
  FileDown,
} from 'lucide-react';
import type { SavedNoteRecord } from '../types/notes';
import { getYouTubeThumbnailUrl } from '../utils/youtube';
import { generateNotesPdf } from '../utils/pdf';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedNotes: SavedNoteRecord[];
  onSelectNote: (record: SavedNoteRecord) => void;
  onDeleteNote: (id: string) => void;
  onClearAll: () => void;
  activeVideoId?: string;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedNotes,
  onSelectNote,
  onDeleteNote,
  onClearAll,
  activeVideoId,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  const handleExportPdfDirect = (e: React.MouseEvent, item: SavedNoteRecord) => {
    e.stopPropagation();
    generateNotesPdf(item.notes, item.videoId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print">
      <div
        className="fixed inset-0 bg-neutral-900/40 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-neutral-100 flex items-center justify-center text-neutral-800 border border-neutral-200">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-editorial text-base font-bold text-neutral-900 leading-none">
                  Saved Notes
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {savedNotes.length} saved locally
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {savedNotes.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-neutral-800 font-editorial">
                  No Saved Notes Yet
                </p>
                <p className="text-xs text-neutral-500 font-mono mt-1 max-w-xs mx-auto">
                  Synthesize a lecture URL to begin your collection.
                </p>
              </div>
            ) : (
              savedNotes.map((item) => {
                const isCurrent = activeVideoId === item.videoId;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectNote(item);
                      onClose();
                    }}
                    className={`group relative bg-white border rounded-2xl p-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${
                      isCurrent
                        ? 'border-neutral-900 bg-neutral-50/50 ring-1 ring-neutral-900/10'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                        {item.platform === 'youtube' || !item.platform ? (
                          <img
                            src={getYouTubeThumbnailUrl(item.videoId)}
                            alt="Lecture Thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white font-mono text-[9px] uppercase font-bold p-1 text-center">
                            <span>{item.platform}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 mb-1">
                          <span className="px-1.5 py-0.5 rounded bg-neutral-900 text-white font-bold uppercase text-[9px]">
                            {item.platform || 'youtube'}
                          </span>
                          <Calendar className="w-3 h-3 ml-1" />
                          <span>{formatDate(item.savedAt)}</span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                          {item.notes.title}
                        </h4>

                        <p className="text-xs text-neutral-500 line-clamp-2 mt-0.5 font-sans leading-relaxed">
                          {item.notes.tldr}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleExportPdfDirect(e, item)}
                          className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-full transition-colors"
                          title="Download PDF"
                        >
                          <FileDown className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNote(item.id);
                        }}
                        className="p-1 rounded-full text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {savedNotes.length > 0 && (
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-500">
                {savedNotes.length} notes in vault
              </span>
              <button
                onClick={onClearAll}
                className="text-xs font-mono text-neutral-600 hover:text-red-600 transition-colors underline"
              >
                Clear All Notes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
