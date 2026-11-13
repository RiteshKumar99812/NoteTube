import React, { useRef, useState } from 'react';
import type { VideoNotes, NoteSynthesisStyle } from '../../types/notes';
import { NotesToolbar } from './NotesToolbar';
import { DocumentHeader } from './DocumentHeader';
import { ConceptsList } from './ConceptsList';
import { GlossarySection } from './GlossarySection';
import { QuizSection } from './QuizSection';
import {
  ArrowUp,
  FileText,
  Layers,
  Bookmark,
  HelpCircle,
  Type,
  Maximize2,
  Minimize2,
  Palette,
  Check,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface NotesWorkspaceProps {
  notes: VideoNotes;
  videoId: string;
  onReset: () => void;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
  initialStyle?: NoteSynthesisStyle;
  tabFont?: 'normal' | 'cursive';
  setTabFont?: (font: 'normal' | 'cursive') => void;
}

export const NotesWorkspace: React.FC<NotesWorkspaceProps> = ({
  notes,
  videoId,
  onReset,
  isZenMode = false,
  onToggleZenMode,
  initialStyle = 'full',
  tabFont = 'normal',
  setTabFont,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const conceptsRef = useRef<HTMLDivElement>(null);
  const glossaryRef = useRef<HTMLDivElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  const fontClass = tabFont === 'cursive' ? 'tab-font-cursive' : 'tab-font-normal';

  const [activeFormat, setActiveFormat] = useState<'full' | 'short'>(
    initialStyle === 'short' ? 'short' : 'full'
  );
  const [fontSizeMode, setFontSizeMode] = useState<'standard' | 'large' | 'extra-large'>('large');
  const [paperTheme, setPaperTheme] = useState<'white' | 'warm' | 'slate'>('white');
  const [activeSectionFilter, setActiveSectionFilter] = useState<'all' | 'concepts' | 'glossary' | 'quiz'>('all');

  const scrollToTop = () => {
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getPaperThemeClass = () => {
    switch (paperTheme) {
      case 'warm':
        return 'paper-warm shadow-[0_4px_30px_rgba(217,119,6,0.06),0_24px_64px_-12px_rgba(0,0,0,0.08)]';
      case 'slate':
        return 'paper-slate shadow-[0_4px_30px_rgba(71,85,105,0.06),0_24px_64px_-12px_rgba(0,0,0,0.08)]';
      case 'white':
      default:
        return 'paper-white shadow-[0_4px_24px_rgba(0,0,0,0.04),0_24px_64px_-12px_rgba(0,0,0,0.08)]';
    }
  };

  const shortNotesData = notes.short_notes || {
    executive_brief: notes.tldr,
    key_takeaways: notes.key_concepts.map((c) => c.bullets[0] || c.heading).slice(0, 4),
    core_principles: notes.key_concepts.map((c) => c.heading).slice(0, 3),
    quick_lexicon: notes.glossary.slice(0, 3),
  };

  return (
    <article
      ref={containerRef}
      className={`w-full transition-all duration-300 pb-20 animate-in fade-in ${
        isZenMode ? 'max-w-7xl mx-auto px-4 sm:px-8' : 'max-w-6xl mx-auto px-2 sm:px-4'
      }`}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 bg-white border border-neutral-200 rounded-2xl px-5 py-2.5 shadow-sm transition-all duration-200 no-print">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs uppercase tracking-wider text-neutral-500 mr-1 font-bold">
            Format:
          </span>
          <button
            onClick={() => setActiveFormat('full')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer btn-spring ${
              activeFormat === 'full'
                ? 'bg-[#1E293B] text-white shadow-md shadow-slate-900/30'
                : 'text-neutral-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Detailed Notes
          </button>
          <button
            onClick={() => setActiveFormat('short')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer btn-spring ${
              activeFormat === 'short'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-neutral-700 hover:text-red-700 hover:bg-red-50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-white" />
              <span>Quick Summary</span>
            </span>
          </button>

          {activeFormat === 'full' && (
            <>
              <span className="text-neutral-300 mx-1">|</span>
              <button
                onClick={() => setActiveSectionFilter('all')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all duration-200 cursor-pointer ${
                  activeSectionFilter === 'all'
                    ? 'bg-neutral-200 text-neutral-900'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All Sections
              </button>
              <button
                onClick={() => {
                  setActiveSectionFilter('concepts');
                  scrollTo(conceptsRef);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all duration-200 cursor-pointer ${
                  activeSectionFilter === 'concepts'
                    ? 'bg-red-100 text-red-800'
                    : 'text-neutral-600 hover:text-red-700'
                }`}
              >
                Concepts
              </button>
              <button
                onClick={() => {
                  setActiveSectionFilter('glossary');
                  scrollTo(glossaryRef);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all duration-200 cursor-pointer ${
                  activeSectionFilter === 'glossary'
                    ? 'bg-teal-100 text-teal-800'
                    : 'text-neutral-600 hover:text-teal-700'
                }`}
              >
                Glossary
              </button>
              <button
                onClick={() => {
                  setActiveSectionFilter('quiz');
                  scrollTo(quizRef);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all duration-200 cursor-pointer ${
                  activeSectionFilter === 'quiz'
                    ? 'bg-amber-100 text-amber-800'
                    : 'text-neutral-600 hover:text-amber-700'
                }`}
              >
                Quiz
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {setTabFont && (
            <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-300 rounded-full p-1 shadow-2xs">
              <span className="text-[10px] font-bold text-neutral-500 pl-2 pr-1">Font:</span>
              <button
                onClick={() => setTabFont('normal')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  tabFont === 'normal'
                    ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="Use Clean Normal Sans Font"
              >
                Normal Font
              </button>
              <button
                onClick={() => setTabFont('cursive')}
                className={`px-3 py-1 rounded-full text-xs transition-all duration-200 cursor-pointer ${
                  tabFont === 'cursive'
                    ? 'bg-neutral-900 text-white shadow-2xs font-bold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                style={{ fontFamily: "'Caveat', cursive, serif", fontSize: '15px' }}
                title="Use Cursive Script Font"
              >
                Cursive Font
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 rounded-full p-1">
            <span className="text-[10px] font-mono text-neutral-500 pl-2 pr-1 flex items-center gap-1 font-semibold">
              <Type className="w-3 h-3 text-neutral-500" />
              Size:
            </span>
            <button
              onClick={() => setFontSizeMode('standard')}
              className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold transition-all duration-200 cursor-pointer ${
                fontSizeMode === 'standard'
                  ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Standard Reading Scale"
            >
              A-
            </button>
            <button
              onClick={() => setFontSizeMode('large')}
              className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold transition-all duration-200 cursor-pointer ${
                fontSizeMode === 'large'
                  ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Large Editorial Scale"
            >
              A
            </button>
            <button
              onClick={() => setFontSizeMode('extra-large')}
              className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold transition-all duration-200 cursor-pointer ${
                fontSizeMode === 'extra-large'
                  ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Spacious Reading Scale"
            >
              A+
            </button>
          </div>

          <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 rounded-full p-1">
            <span className="text-[10px] font-mono text-neutral-500 pl-2 pr-1 flex items-center gap-1 font-semibold">
              <Palette className="w-3 h-3 text-neutral-500" />
              Paper:
            </span>
            <button
              onClick={() => setPaperTheme('white')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                paperTheme === 'white'
                  ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Pure Studio White Paper"
            >
              {paperTheme === 'white' && <Check className="w-2.5 h-2.5 text-red-600" />}
              White
            </button>
            <button
              onClick={() => setPaperTheme('warm')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                paperTheme === 'warm'
                  ? 'bg-[#F4EFE6] text-amber-950 shadow-2xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Warm Ivory Parchment"
            >
              {paperTheme === 'warm' && <Check className="w-2.5 h-2.5 text-amber-700" />}
              Ivory
            </button>
            <button
              onClick={() => setPaperTheme('slate')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                paperTheme === 'slate'
                  ? 'bg-[#E2E8F0] text-slate-900 shadow-2xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Cool Slate Drafting Paper"
            >
              {paperTheme === 'slate' && <Check className="w-2.5 h-2.5 text-slate-700" />}
              Slate
            </button>
          </div>

          {onToggleZenMode && (
            <button
              onClick={onToggleZenMode}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all duration-200 cursor-pointer btn-spring ${
                isZenMode
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300'
              }`}
              title={isZenMode ? 'Exit Zen Focus Mode' : 'Enter Zen Focus Mode (Distraction-Free)'}
            >
              {isZenMode ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Exit Focus</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Zen Focus</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div
        className={`border border-neutral-300 rounded-3xl p-6 sm:p-10 lg:p-14 transition-all duration-300 relative ${getPaperThemeClass()}`}
      >
        <NotesToolbar
          notes={notes}
          videoId={videoId}
          onReset={onReset}
        />

        <div className="pt-5 pb-3 flex flex-wrap items-center gap-2.5 no-print border-b border-neutral-200">
          <span className="text-xs uppercase tracking-wider text-neutral-500 mr-1 font-bold">
            Jump:
          </span>
          <button
            onClick={() => scrollToTop()}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-full transition-all duration-200 cursor-pointer btn-spring shadow-xs shadow-red-600/30 ${fontClass}`}
          >
            <FileText className="w-3.5 h-3.5 text-white" />
            <span>Summary</span>
          </button>
          <button
            onClick={() => scrollTo(conceptsRef)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#1E293B] hover:bg-slate-900 rounded-full transition-all duration-200 cursor-pointer btn-spring shadow-xs shadow-slate-900/30 ${fontClass}`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-300" />
            <span>Key Points ({notes.key_concepts.length})</span>
          </button>
          <button
            onClick={() => scrollTo(glossaryRef)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#0F766E] hover:bg-teal-800 rounded-full transition-all duration-200 cursor-pointer btn-spring shadow-xs shadow-teal-700/30 ${fontClass}`}
          >
            <Bookmark className="w-3.5 h-3.5 text-teal-200" />
            <span>Key Terms ({notes.glossary.length})</span>
          </button>
          <button
            onClick={() => scrollTo(quizRef)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#D97706] hover:bg-amber-700 rounded-full transition-all duration-200 cursor-pointer btn-spring shadow-xs shadow-amber-600/30 ${fontClass}`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-200" />
            <span>Quiz ({notes.revision_questions.length})</span>
          </button>
        </div>

        <DocumentHeader
          notes={notes}
          videoId={videoId}
          fontSizeMode={fontSizeMode}
          tabFont={tabFont}
        />

        {activeFormat === 'short' ? (
          <div className="mt-8 space-y-6 animate-in fade-in duration-200">
            <div className="bg-red-50/70 border border-red-300 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-xs ${fontClass}`}>
                  Quick Summary
                </span>
                <span className="text-xs text-red-900 font-semibold">Key Takeaways</span>
              </div>
              <p className="font-editorial text-lg sm:text-xl text-neutral-900 leading-relaxed">
                {shortNotesData.executive_brief}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-slate-50 border border-slate-300 rounded-2xl p-6 shadow-xs">
                <span className={`px-3 py-1 rounded-full bg-[#1E293B] text-white font-bold text-xs uppercase tracking-wider inline-block mb-4 shadow-xs ${fontClass}`}>
                  Core Concepts
                </span>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-900">
                  {shortNotesData.core_principles.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-teal-50/70 border border-teal-300 rounded-2xl p-6 shadow-xs">
                <span className={`px-3 py-1 rounded-full bg-[#0F766E] text-white font-bold text-xs uppercase tracking-wider inline-block mb-4 shadow-xs ${fontClass}`}>
                  Key Takeaways
                </span>
                <ul className="space-y-3 text-xs sm:text-sm text-teal-950 font-sans">
                  {shortNotesData.key_takeaways.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-teal-200">
                      <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider shadow-xs ${fontClass}`}>
                  Key Terms & Definitions
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {shortNotesData.quick_lexicon.map((item, idx) => (
                  <div key={idx} className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                    <span className="font-bold text-sm text-neutral-900 block mb-1">{item.term}</span>
                    <p className="text-xs text-neutral-600 line-clamp-3">{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {(activeSectionFilter === 'all' || activeSectionFilter === 'concepts') && (
              <div ref={conceptsRef} className="mt-10 pt-2">
                <ConceptsList
                  concepts={notes.key_concepts}
                  videoId={videoId}
                  fontSizeMode={fontSizeMode}
                  tabFont={tabFont}
                />
              </div>
            )}

            {(activeSectionFilter === 'all' || activeSectionFilter === 'glossary') && (
              <div ref={glossaryRef} className="mt-10 pt-2">
                <GlossarySection
                  glossary={notes.glossary}
                  fontSizeMode={fontSizeMode}
                  tabFont={tabFont}
                />
              </div>
            )}

            {(activeSectionFilter === 'all' || activeSectionFilter === 'quiz') && (
              <div ref={quizRef} className="mt-10 pt-2">
                <QuizSection
                  quizItems={notes.revision_questions}
                  fontSizeMode={fontSizeMode}
                  tabFont={tabFont}
                />
              </div>
            )}
          </>
        )}

        <div className="mt-14 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3 no-print">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-700">NoteTube</span>
            <span>•</span>
            <span>Study Notes & Practice Questions</span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-neutral-800 hover:text-neutral-950 font-semibold transition-all duration-200 px-3.5 py-1.5 rounded-full hover:bg-neutral-100 cursor-pointer btn-spring"
          >
            <ArrowUp className="w-4 h-4 text-red-600" />
            <span>Back to top</span>
          </button>
        </div>
      </div>
    </article>
  );
};
