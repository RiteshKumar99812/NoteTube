import React from 'react';
import { Play, Layers, ExternalLink } from 'lucide-react';
import type { ConceptSection } from '../../types/notes';
import { getYouTubeWatchUrl } from '../../utils/youtube';

interface ConceptsListProps {
  concepts: ConceptSection[];
  videoId: string;
  fontSizeMode?: 'standard' | 'large' | 'extra-large';
  tabFont?: 'normal' | 'cursive';
}

const colorCycles = [
  {
    borderTop: 'border-t-4 border-t-red-600',
    badge: 'bg-red-600 text-white shadow-xs shadow-red-600/30',
  },
  {
    borderTop: 'border-t-4 border-t-[#0F766E]',
    badge: 'bg-[#0F766E] text-white shadow-xs shadow-teal-700/30',
  },
  {
    borderTop: 'border-t-4 border-t-[#D97706]',
    badge: 'bg-[#D97706] text-white shadow-xs shadow-amber-600/30',
  },
  {
    borderTop: 'border-t-4 border-t-[#1E293B]',
    badge: 'bg-[#1E293B] text-white shadow-xs shadow-slate-900/30',
  },
];

export const ConceptsList: React.FC<ConceptsListProps> = ({
  concepts,
  videoId,
  fontSizeMode = 'standard',
  tabFont = 'normal',
}) => {
  if (!concepts || concepts.length === 0) return null;

  const fontClass = tabFont === 'cursive' ? 'tab-font-cursive' : 'tab-font-normal';

  const bulletTextSize =
    fontSizeMode === 'extra-large'
      ? 'text-lg sm:text-[19px] leading-[1.85]'
      : fontSizeMode === 'large'
      ? 'text-base sm:text-[17px] leading-[1.8]'
      : 'text-[15px] sm:text-base leading-[1.75]';

  return (
    <section id="concepts" className="space-y-5 pt-4">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-neutral-900" />
          <h2 className="font-editorial text-xl sm:text-2xl font-medium tracking-tight text-neutral-900">
            Key Concepts
          </h2>
        </div>
        <span className="text-xs font-bold text-white px-3.5 py-1 rounded-full bg-[#1E293B] shadow-2xs">
          {concepts.length} topics
        </span>
      </div>

      <div className="space-y-4">
        {concepts.map((concept, index) => {
          const color = colorCycles[index % colorCycles.length];
          const timestampUrl = concept.timestamp
            ? getYouTubeWatchUrl(videoId, concept.timestamp)
            : null;

          return (
            <div
              key={index}
              id={`concept-${index}`}
              className={`bg-white border border-neutral-200 ${color.borderTop} rounded-2xl p-6 sm:p-7 shadow-xs hover:border-neutral-300 card-interactive print-break-inside-avoid scroll-mt-24 transition-all`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${color.badge} ${fontClass}`}>
                    Topic {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>
                  <h3 className="font-editorial text-lg sm:text-xl font-medium text-neutral-900 tracking-tight leading-snug">
                    {concept.heading}
                  </h3>
                </div>

                {concept.timestamp && timestampUrl && (
                  <a
                    href={timestampUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-[#1E293B] hover:bg-slate-900 border border-slate-900 transition-all duration-200 shrink-0 group self-start sm:self-auto cursor-pointer btn-spring shadow-2xs ${fontClass}`}
                    title={`Jump to ${concept.timestamp}`}
                  >
                    <Play className="w-3 h-3 text-red-400 fill-red-400 transition-transform group-hover:scale-110" />
                    <span>{concept.timestamp}</span>
                    <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-white ml-0.5" />
                  </a>
                )}
              </div>

              <ul className={`space-y-2.5 text-neutral-800 pl-1 ${bulletTextSize}`}>
                {concept.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-3">
                    <span className="text-neutral-400 font-bold select-none mt-0.5 shrink-0">—</span>
                    <span className="flex-1 font-normal leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};
