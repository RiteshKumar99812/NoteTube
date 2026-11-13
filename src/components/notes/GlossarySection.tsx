import React from 'react';
import { Bookmark } from 'lucide-react';
import type { GlossaryItem } from '../../types/notes';

interface GlossarySectionProps {
  glossary: GlossaryItem[];
  fontSizeMode?: 'standard' | 'large' | 'extra-large';
  tabFont?: 'normal' | 'cursive';
}

export const GlossarySection: React.FC<GlossarySectionProps> = ({
  glossary,
  fontSizeMode = 'standard',
  tabFont = 'normal',
}) => {
  if (!glossary || glossary.length === 0) return null;

  const fontClass = tabFont === 'cursive' ? 'tab-font-cursive' : 'tab-font-normal';

  const defTextSize =
    fontSizeMode === 'extra-large'
      ? 'text-base sm:text-[17px] leading-[1.8]'
      : fontSizeMode === 'large'
      ? 'text-[15px] sm:text-base leading-[1.75]'
      : 'text-sm sm:text-[15px] leading-relaxed';

  return (
    <section id="glossary" className="space-y-5 pt-4 scroll-mt-24">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2.5">
          <Bookmark className="w-5 h-5 text-[#0F766E]" />
          <h2 className="font-editorial text-xl sm:text-2xl font-medium tracking-tight text-neutral-900">
            Key Terms & Definitions
          </h2>
        </div>
        <span className="text-xs font-bold text-white px-3.5 py-1 rounded-full bg-[#0F766E] shadow-2xs">
          {glossary.length} terms
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {glossary.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-neutral-200 border-l-4 border-l-[#0F766E] rounded-2xl p-5 shadow-xs hover:border-neutral-300 card-interactive flex flex-col justify-between print-break-inside-avoid transition-all"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Bookmark className="w-4 h-4 text-[#0F766E] shrink-0" />
                <h4 className={`text-base font-bold text-neutral-900 tracking-tight ${fontClass}`}>
                  {item.term}
                </h4>
              </div>
              <p className={`text-neutral-700 font-normal ${defTextSize}`}>
                {item.definition}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-100 flex justify-between items-center">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Term #{idx + 1}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-white px-2.5 py-0.5 rounded-full bg-[#1E293B] shadow-2xs">
                Definition
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
