import React from 'react';
import { ExternalLink, Clock, BookOpen, Quote } from 'lucide-react';
import type { VideoNotes, LecturePlatform } from '../../types/notes';
import { getYouTubeThumbnailUrl } from '../../utils/youtube';

interface DocumentHeaderProps {
  notes: VideoNotes;
  videoId: string;
  fontSizeMode?: 'standard' | 'large' | 'extra-large';
  platform?: LecturePlatform;
  tabFont?: 'normal' | 'cursive';
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  notes,
  videoId,
  fontSizeMode = 'standard',
  platform,
  tabFont = 'normal',
}) => {
  const effectivePlatform = platform || notes.platform || 'youtube';
  const fontClass = tabFont === 'cursive' ? 'tab-font-cursive' : 'tab-font-normal';

  const allText = `${notes.title} ${notes.tldr} ${notes.key_concepts
    .map((c) => `${c.heading} ${c.bullets.join(' ')}`)
    .join(' ')}`;
  const wordCount = allText.split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  const tldrTextSize =
    fontSizeMode === 'extra-large'
      ? 'text-lg sm:text-xl leading-[1.85]'
      : fontSizeMode === 'large'
      ? 'text-base sm:text-lg leading-[1.8]'
      : 'text-[15px] sm:text-base leading-[1.75]';

  const platformBadgeStyles: Record<LecturePlatform, string> = {
    youtube: 'bg-red-600 text-white border-red-700',
    coursera: 'bg-[#0056D2] text-white border-blue-800',
    udemy: 'bg-[#A435F0] text-white border-purple-800',
    edx: 'bg-[#B52519] text-white border-red-900',
    vimeo: 'bg-[#1AB7EA] text-white border-sky-600',
    loom: 'bg-[#625DF5] text-white border-indigo-700',
    web: 'bg-[#1E293B] text-white border-slate-900',
  };

  const platformSourceUrl =
    effectivePlatform === 'youtube'
      ? `https://www.youtube.com/watch?v=${videoId}`
      : effectivePlatform === 'coursera'
      ? `https://www.coursera.org/learn/${videoId}`
      : effectivePlatform === 'udemy'
      ? `https://www.udemy.com/course/${videoId}`
      : effectivePlatform === 'edx'
      ? `https://www.edx.org/course/${videoId}`
      : `https://www.google.com/search?q=${encodeURIComponent(notes.title)}`;

  return (
    <div className="space-y-6 pt-2">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-neutral-200 text-xs text-neutral-600">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs ${platformBadgeStyles[effectivePlatform]}`}>
            {effectivePlatform}
          </span>
          <span className="font-bold text-neutral-800">Study Notes</span>
          <span className="text-neutral-300">•</span>
          <span>{new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E293B] text-white font-bold shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-slate-300" />
            <span>{readTimeMinutes} min read</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F766E] text-white font-bold shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-teal-200" />
            <span>{notes.key_concepts.length} key points</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-2">
        <div className="flex-1 min-w-0">
          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-neutral-900 leading-[1.15]">
            {notes.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href={platformSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-900 text-xs font-bold text-white transition-all duration-200 group cursor-pointer btn-spring shadow-2xs ${fontClass}`}
            >
              <span className="uppercase">{effectivePlatform}: {videoId}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-white ml-0.5" />
            </a>

            <span className="text-xs text-neutral-500 font-medium">
              Generated on {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="hidden lg:block shrink-0">
          <a
            href={platformSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative w-44 h-26 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm group cursor-pointer card-interactive"
          >
            {effectivePlatform === 'youtube' ? (
              <img
                src={getYouTubeThumbnailUrl(videoId)}
                alt="Thumbnail preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-2 text-center">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase mb-1 ${platformBadgeStyles[effectivePlatform]}`}>
                  {effectivePlatform}
                </span>
                <span className="text-xs text-slate-300 truncate max-w-full">{videoId}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-neutral-900/20 group-hover:bg-neutral-900/10 transition-colors flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center shadow-xs">
                <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </a>
        </div>
      </div>

      <div
        id="tldr"
        className="relative bg-white border border-neutral-200 border-l-4 border-l-red-600 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-neutral-300 transition-all"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900">
            Summary & Key Takeaways
          </h2>
          <Quote className="w-5 h-5 text-neutral-300 hidden sm:block" />
        </div>
        <p className={`font-sans text-neutral-800 font-normal ${tldrTextSize}`}>
          {notes.tldr}
        </p>
      </div>
    </div>
  );
};
