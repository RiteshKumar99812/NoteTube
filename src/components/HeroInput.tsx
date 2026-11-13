import React, { useState, useEffect } from 'react';
import {
  Link as LinkIcon,
  Clipboard,
  X,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Play,
  Volume2,
  GraduationCap,
} from 'lucide-react';
import {
  extractLectureSource,
  getYouTubeThumbnailUrl,
  type ParsedLectureSource,
} from '../utils/youtube';
import { SAMPLE_NOTES, type SampleVideoItem } from '../data/sampleNotes';
import type { NoteSynthesisStyle, LecturePlatform } from '../types/notes';

interface HeroInputProps {
  urlInput: string;
  setUrlInput: (val: string) => void;
  detectedVideoId: string | null;
  onGenerate: (videoId: string, platform?: LecturePlatform, style?: NoteSynthesisStyle) => void;
  isLoading: boolean;
  synthesisStyle?: NoteSynthesisStyle;
  setSynthesisStyle?: (style: NoteSynthesisStyle) => void;
  tabFont?: 'normal' | 'cursive';
  showDemoSection?: boolean;
  onSelectSample?: (sample: SampleVideoItem) => void;
}

export const HeroInput: React.FC<HeroInputProps> = ({
  urlInput,
  setUrlInput,
  detectedVideoId,
  onGenerate,
  isLoading,
  synthesisStyle = 'full',
  setSynthesisStyle,
  tabFont = 'normal',
  showDemoSection = false,
  onSelectSample,
}) => {
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const [thumbError, setThumbError] = useState(false);
  const [localStyle, setLocalStyle] = useState<NoteSynthesisStyle>(synthesisStyle);

  const fontClass = tabFont === 'cursive' ? 'tab-font-cursive' : 'tab-font-normal';

  const parsedSource: ParsedLectureSource | null = React.useMemo(() => {
    return extractLectureSource(urlInput);
  }, [urlInput]);

  useEffect(() => {
    setThumbError(false);
  }, [detectedVideoId, parsedSource?.id]);

  const effectiveStyle = synthesisStyle || localStyle;

  const handleStyleChange = (style: NoteSynthesisStyle) => {
    setLocalStyle(style);
    if (setSynthesisStyle) {
      setSynthesisStyle(style);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text.trim());
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 1500);
      }
    } catch {}
  };

  const handleClear = () => {
    setUrlInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const source = parsedSource || extractLectureSource(urlInput);
    if (source && !isLoading) {
      onGenerate(source.id, source.platform, effectiveStyle);
    }
  };

  const isInvalidUrl = urlInput.trim().length > 0 && !parsedSource && !detectedVideoId;

  const platformBadgeStyles: Record<LecturePlatform, string> = {
    youtube: 'bg-red-600 text-white border-red-700',
    coursera: 'bg-[#0056D2] text-white border-blue-800',
    udemy: 'bg-[#A435F0] text-white border-purple-800',
    edx: 'bg-[#B52519] text-white border-red-900',
    vimeo: 'bg-[#1AB7EA] text-white border-sky-600',
    loom: 'bg-[#625DF5] text-white border-indigo-700',
    web: 'bg-[#1E293B] text-white border-slate-900',
  };

  return (
    <section className="pt-6 pb-8 sm:pt-10 sm:pb-10 text-center max-w-5xl mx-auto px-4 relative z-10">
      <h1 className="font-editorial text-3xl sm:text-5xl lg:text-[52px] font-normal tracking-tight text-neutral-900 max-w-3xl mx-auto leading-[1.15]">
        Turn any video into{' '}
        <span className="italic font-normal underline decoration-red-600 decoration-2 underline-offset-8">
          clear study notes.
        </span>
      </h1>

      <p className="mt-3.5 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed font-normal">
        Paste a link from YouTube, Coursera, Udemy, or edX to get instant summaries, key takeaways, and practice questions.
      </p>

      <div className="mt-6 inline-flex items-center p-1 bg-neutral-100 rounded-full border border-neutral-200">
        <button
          type="button"
          onClick={() => handleStyleChange('full')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${fontClass} ${
            effectiveStyle === 'full'
              ? 'bg-[#1E293B] text-white shadow-xs'
              : 'text-neutral-700 hover:text-neutral-900'
          }`}
        >
          Detailed Notes
        </button>
        <button
          type="button"
          onClick={() => handleStyleChange('short')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${fontClass} ${
            effectiveStyle === 'short'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-neutral-700 hover:text-neutral-900'
          }`}
        >
          Quick Summary
        </button>
        <button
          type="button"
          onClick={() => handleStyleChange('revision')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${fontClass} ${
            effectiveStyle === 'revision'
              ? 'bg-[#D97706] text-white shadow-xs'
              : 'text-neutral-700 hover:text-neutral-900'
          }`}
        >
          Practice Quiz
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl mx-auto">
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-full border border-neutral-300 shadow-[0_2px_12px_rgba(0,0,0,0.06),0_12px_28px_-6px_rgba(0,0,0,0.08)] hover:border-neutral-400 focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/10 transition-all p-2 pl-4 sm:pl-5 gap-2">
          <div className="flex items-center flex-1 min-w-0 py-1">
            <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center shrink-0 mr-3 text-white border border-neutral-900 shadow-2xs">
              <LinkIcon className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste video or course link (YouTube, Coursera, Udemy, edX)..."
              className="w-full bg-transparent border-none text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden font-sans"
              disabled={isLoading}
              autoFocus
            />

            {!urlInput && (
              <button
                type="button"
                onClick={handlePaste}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-all duration-200 shrink-0 ml-1 cursor-pointer btn-spring border border-neutral-300"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3 h-3 text-neutral-600" />
                <span>{pasteSuccess ? 'Pasted!' : 'Paste'}</span>
              </button>
            )}

            {urlInput && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors shrink-0 ml-1 cursor-pointer"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={(!parsedSource && !detectedVideoId) || isLoading}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase text-white transition-all duration-200 shrink-0 cursor-pointer ${
              (parsedSource || detectedVideoId) && !isLoading
                ? 'bg-red-600 hover:bg-red-700 border border-red-700 shadow-md shadow-red-600/30 btn-spring'
                : 'bg-neutral-300 text-neutral-500 cursor-not-allowed opacity-80'
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>Generate Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {isInvalidUrl && (
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-full py-2 px-4 max-w-md mx-auto shadow-xs">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>Enter a valid course URL from YouTube, Coursera, Udemy, edX, or Web video.</span>
          </div>
        )}

        <p className="mt-3 text-xs text-neutral-500 font-medium">
          Supports YouTube, Coursera, Udemy, edX and web videos • Free PDF and Markdown download
        </p>
      </form>

      {parsedSource && (
        <div className="mt-7 max-w-xl mx-auto bg-white rounded-2xl border border-neutral-300 p-4 shadow-sm text-left transition-all card-interactive">
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-18 bg-neutral-100 rounded-xl overflow-hidden shrink-0 border border-neutral-200 group">
              {parsedSource.platform === 'youtube' && !thumbError ? (
                <img
                  src={getYouTubeThumbnailUrl(parsedSource.id)}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                  onError={() => setThumbError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white text-xs p-1 text-center">
                  <GraduationCap className="w-5 h-5 text-red-400 mb-0.5" />
                  <span className="uppercase font-bold tracking-wider text-xs">{parsedSource.platform}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-neutral-900/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center shadow-xs">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider border shadow-2xs ${platformBadgeStyles[parsedSource.platform]}`}>
                  {parsedSource.platform}
                </span>

                <div className="flex items-center gap-0.5 h-4 px-1.5 bg-red-50 rounded-full border border-red-200">
                  <Volume2 className="w-2.5 h-2.5 text-red-600 mr-0.5" />
                  <div className="wave-bar !h-2.5" />
                  <div className="wave-bar !h-3" />
                  <div className="wave-bar !h-2" />
                </div>
              </div>
              <p className="mt-1 text-sm font-semibold text-neutral-900 truncate">
                {parsedSource.displayLabel}
              </p>
              <div className="mt-1 flex items-center gap-3">
                <a
                  href={parsedSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-red-600 transition-colors"
                >
                  <span>Open Source Video</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <button
              onClick={handleClear}
              className="text-neutral-400 hover:text-neutral-700 p-2 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Remove detected source"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {showDemoSection && onSelectSample && (
        <div className="mt-8 pt-6 border-t border-neutral-200 max-w-4xl mx-auto text-left">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Loaded Demo Lectures</span>
            </div>
            <span className="text-xs text-neutral-500 font-medium">Click any lecture to load notes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {SAMPLE_NOTES.map((sample, idx) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => onSelectSample(sample)}
                className="group bg-white hover:bg-neutral-50/80 border border-neutral-300 hover:border-neutral-400 rounded-2xl p-4 text-left transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between card-interactive"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-white shadow-2xs ${platformBadgeStyles[sample.platform]}`}>
                      {sample.platform}
                    </span>
                    <span className="text-neutral-500 font-semibold px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200">
                      Demo 0{idx + 1}
                    </span>
                  </div>
                  <p className="font-editorial text-sm font-medium text-neutral-900 mt-1 line-clamp-2 leading-snug group-hover:text-red-700 transition-colors">
                    {sample.label}
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                  <span className="text-neutral-600 font-semibold">{sample.topic}</span>
                  <span className="text-red-600 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-sans">
                    Load &rarr;
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
