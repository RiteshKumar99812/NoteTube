import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white py-6 w-full no-print">
      <div className="w-full px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white text-[10px]">
            <svg className="w-3 h-3 fill-current ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="font-editorial text-sm font-bold text-neutral-900">NoteTube</span>
          <span>—</span>
          <span className="font-sans text-neutral-600">Video Study Notes & Quizzes</span>
        </div>

        <div className="flex items-center gap-4 text-neutral-600 font-medium">
          <span>Saved Locally</span>
          <span className="text-neutral-300">•</span>
          <span>PDF & Markdown Export</span>
          <span className="text-neutral-300">•</span>
          <span>Interactive Timestamps</span>
        </div>
      </div>
    </footer>
  );
};
