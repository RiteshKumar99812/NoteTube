import React, { useState } from 'react';
import {
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { QuizItem } from '../../types/notes';

interface QuizSectionProps {
  quizItems: QuizItem[];
  fontSizeMode?: 'standard' | 'large' | 'extra-large';
  tabFont?: 'normal' | 'cursive';
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  quizItems,
  fontSizeMode = 'standard',
  tabFont = 'normal',
}) => {
  const [revealedMap, setRevealedMap] = useState<Record<number, boolean>>({});

  const fontClass = tabFont === 'cursive' ? 'tab-font-cursive' : 'tab-font-normal';

  if (!quizItems || quizItems.length === 0) return null;

  const toggleReveal = (index: number) => {
    setRevealedMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const allRevealed =
    quizItems.length > 0 &&
    quizItems.every((_, idx) => Boolean(revealedMap[idx]));

  const toggleAll = () => {
    if (allRevealed) {
      setRevealedMap({});
    } else {
      const fullMap: Record<number, boolean> = {};
      quizItems.forEach((_, idx) => {
        fullMap[idx] = true;
      });
      setRevealedMap(fullMap);
    }
  };

  const questionTextSize =
    fontSizeMode === 'extra-large'
      ? 'text-lg sm:text-xl font-bold'
      : fontSizeMode === 'large'
      ? 'text-base sm:text-lg font-bold'
      : 'text-base font-semibold';

  const answerTextSize =
    fontSizeMode === 'extra-large'
      ? 'text-base sm:text-lg leading-[1.8]'
      : fontSizeMode === 'large'
      ? 'text-[15px] sm:text-base leading-[1.75]'
      : 'text-sm sm:text-[15px] leading-relaxed';

  return (
    <section id="quiz" className="space-y-5 pt-4 scroll-mt-24">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-[#D97706]" />
          <h2 className="font-editorial text-xl sm:text-2xl font-medium tracking-tight text-neutral-900">
            Practice Questions & Quiz
          </h2>
        </div>

        <button
          onClick={toggleAll}
          className={`inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#D97706] hover:bg-amber-700 px-4 py-2 rounded-full shadow-xs transition-all duration-200 cursor-pointer no-print btn-spring ${fontClass}`}
        >
          {allRevealed ? (
            <>
              <ChevronUp className="w-4 h-4 text-amber-200" />
              <span>Hide All Answers</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 text-amber-200" />
              <span>Reveal All Answers</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        {quizItems.map((item, index) => {
          const isRevealed = Boolean(revealedMap[index]);

          return (
            <div
              key={index}
              className="bg-white border border-neutral-200 border-l-4 border-l-[#D97706] rounded-2xl overflow-hidden transition-all duration-300 shadow-xs hover:border-neutral-300 print-break-inside-avoid"
            >
              <div
                onClick={() => toggleReveal(index)}
                className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-amber-50/20 transition-colors select-none"
              >
                <div className="flex items-start gap-3.5">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#D97706] text-white font-bold text-xs shrink-0 mt-0.5 shadow-xs shadow-amber-600/30">
                    Q{index + 1}
                  </span>
                  <p className={`font-sans text-neutral-900 leading-snug ${questionTextSize}`}>
                    {item.question}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleReveal(index);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all duration-200 cursor-pointer no-print btn-spring ${
                    isRevealed
                      ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
                      : 'bg-[#1E293B] hover:bg-slate-900 text-white shadow-xs'
                  }`}
                >
                  {isRevealed ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Hide Answer</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-slate-300" />
                      <span>Show Answer</span>
                    </>
                  )}
                </button>
              </div>

              {isRevealed && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 animate-in fade-in slide-in-from-top-1 duration-250">
                  <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 leading-relaxed flex items-start gap-3.5">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="inline-block text-xs font-bold uppercase tracking-wider bg-emerald-700 text-white px-2.5 py-0.5 rounded-full mb-2">
                        Answer & Explanation
                      </span>
                      <p className={`font-sans text-emerald-950 font-normal ${answerTextSize}`}>{item.answer}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
