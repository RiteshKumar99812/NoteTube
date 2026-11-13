import React, { useState } from 'react';
import {
  Play,
  ExternalLink,
  ListTree,
  FileDown,
  Download,
  Copy,
  Check,
  Printer,
  BarChart2,
  Award,
  Video,
  FileText,
  Bookmark,
  HelpCircle,
} from 'lucide-react';
import type { VideoNotes } from '../../types/notes';
import { getYouTubeThumbnailUrl } from '../../utils/youtube';
import { formatNotesToMarkdown, downloadMarkdownFile } from '../../utils/markdown';
import { generateNotesPdf } from '../../utils/pdf';

interface RightPanelProps {
  notes: VideoNotes | null;
  videoId: string | null;
  tabFont?: 'normal' | 'cursive';
}

export const RightPanel: React.FC<RightPanelProps> = ({
  notes,
  videoId,
  tabFont = 'normal',
}) => {
  const [copied, setCopied] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const fontClass = tabFont === 'cursive' ? 'tab-font-cursive' : 'tab-font-normal';

  const handleCopyMarkdown = async () => {
    if (!notes || !videoId) return;
    try {
      const markdown = formatNotesToMarkdown(notes, videoId);
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!notes || !videoId) return;
    const markdown = formatNotesToMarkdown(notes, videoId);
    const sanitizedTitle =
      notes.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `notetube-${videoId}`;
    downloadMarkdownFile(`${sanitizedTitle}.md`, markdown);
  };

  const handleDownloadPdf = () => {
    if (!notes || !videoId) return;
    setPdfGenerating(true);
    try {
      generateNotesPdf(notes, videoId);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setTimeout(() => setPdfGenerating(false), 800);
    }
  };

  const wordCount = notes
    ? `${notes.title} ${notes.tldr} ${notes.key_concepts.map((c) => c.bullets.join(' ')).join(' ')}`.split(/\s+/).length
    : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <aside className="hidden xl:flex flex-col w-88 sticky top-16 h-[calc(100vh-4rem)] border-l border-neutral-200 bg-white shrink-0 overflow-y-auto p-5 space-y-5 shadow-xs">
      {videoId ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 shadow-2xs space-y-3.5 panel-card-anim">
          <div className="flex items-center justify-between">
            <span className={`text-xs uppercase tracking-wider text-white font-bold flex items-center gap-1.5 bg-red-600 px-3 py-1 rounded-full shadow-xs ${fontClass}`}>
              <Video className="w-3.5 h-3.5 text-white" />
              <span>Source Video</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs text-neutral-800 bg-white px-2.5 py-0.5 rounded-full border border-neutral-200 shadow-2xs font-bold">
              ID: {videoId}
            </div>
          </div>

          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative aspect-video rounded-xl overflow-hidden border border-neutral-200 group shadow-xs cursor-pointer"
          >
            <img
              src={getYouTubeThumbnailUrl(videoId)}
              alt="Video Thumbnail"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-neutral-950/10 transition-colors flex items-center justify-center">
              <div className="w-11 h-11 rounded-full bg-white text-red-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
          </a>

          <div className="flex items-center justify-between text-xs pt-1">
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-neutral-800 hover:text-red-600 transition-colors"
            >
              <span className={fontClass}>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <span className="text-xs text-neutral-500 font-medium">HD Video</span>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 text-center text-neutral-400 text-xs panel-card-anim">
          <Play className="w-6 h-6 mx-auto mb-2 text-neutral-400" />
          <p className="font-semibold text-neutral-700 text-sm">No Video Selected</p>
          <p className="mt-1 text-neutral-500">Paste a link to generate notes</p>
        </div>
      )}

      {notes && videoId && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-4.5 shadow-2xs space-y-3.5 panel-card-anim">
          <div className="flex items-center justify-between">
            <span className={`text-xs uppercase tracking-wider text-neutral-600 font-bold block ${fontClass}`}>
              Export Notes
            </span>
            <span className="text-[10px] font-bold bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full border border-neutral-200">
              Quick Export
            </span>
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={pdfGenerating}
            className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold tracking-wide shadow-md shadow-red-600/30 transition-all duration-200 cursor-pointer btn-spring ${fontClass}`}
          >
            {pdfGenerating ? (
              <span>Preparing PDF...</span>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-white" />
                <span>Download PDF</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyMarkdown}
              className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#1E293B] hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition-all duration-200 cursor-pointer btn-spring ${fontClass}`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>Copy .md</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#0F766E] hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-all duration-200 cursor-pointer btn-spring ${fontClass}`}
            >
              <Download className="w-3.5 h-3.5 text-teal-200" />
              <span>Save .md</span>
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className={`w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#D97706] hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all duration-200 cursor-pointer btn-spring ${fontClass}`}
          >
            <Printer className="w-3.5 h-3.5 text-amber-100" />
            <span>Print Notes</span>
          </button>
        </div>
      )}

      {notes && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-4.5 shadow-2xs space-y-3 panel-card-anim">
          <div className="flex items-center justify-between">
            <span className={`text-xs uppercase tracking-wider text-neutral-600 font-bold ${fontClass}`}>
              Note Stats
            </span>
            <BarChart2 className="w-4 h-4 text-neutral-400" />
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-center">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-300 shadow-2xs transition-transform duration-200 hover:-translate-y-0.5">
              <span className="text-lg font-bold text-slate-900 block leading-tight">
                {wordCount}
              </span>
              <span className={`text-[11px] text-slate-700 mt-0.5 block font-bold uppercase tracking-wider ${fontClass}`}>
                Words
              </span>
            </div>

            <div className="bg-red-50 p-3 rounded-xl border border-red-300 shadow-2xs transition-transform duration-200 hover:-translate-y-0.5">
              <span className="text-lg font-bold text-red-900 block leading-tight">
                {readTimeMinutes} min
              </span>
              <span className={`text-[11px] text-red-700 mt-0.5 block font-bold uppercase tracking-wider ${fontClass}`}>
                Read Time
              </span>
            </div>

            <div className="bg-teal-50 p-3 rounded-xl border border-teal-300 shadow-2xs transition-transform duration-200 hover:-translate-y-0.5">
              <span className="text-lg font-bold text-teal-900 block leading-tight">
                {notes.key_concepts.length}
              </span>
              <span className={`text-[11px] text-[#0F766E] mt-0.5 block font-bold uppercase tracking-wider ${fontClass}`}>
                Key Points
              </span>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-300 shadow-2xs transition-transform duration-200 hover:-translate-y-0.5">
              <span className="text-lg font-bold text-amber-900 block leading-tight">
                {notes.revision_questions.length}
              </span>
              <span className={`text-[11px] text-[#D97706] mt-0.5 block font-bold uppercase tracking-wider ${fontClass}`}>
                Questions
              </span>
            </div>
          </div>
        </div>
      )}

      {notes && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-4.5 shadow-2xs space-y-2.5 panel-card-anim">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <span className={`text-xs uppercase tracking-wider text-neutral-600 font-bold ${fontClass}`}>
              Table of Contents
            </span>
            <ListTree className="w-4 h-4 text-neutral-400" />
          </div>

          <nav className="space-y-1.5 text-xs">
            <a
              href="#tldr"
              className={`flex items-center gap-2.5 p-2 rounded-xl text-neutral-800 hover:bg-red-50 hover:text-red-700 transition-all font-semibold text-xs tab-nudge border border-transparent hover:border-red-200 ${fontClass}`}
            >
              <FileText className="w-4 h-4 text-red-600 shrink-0" />
              <span className="truncate">Summary & Takeaways</span>
            </a>

            <div className="pt-1.5">
              <span className="text-xs text-neutral-500 uppercase px-2 block mb-1 font-bold">
                Key Topics
              </span>
              {notes.key_concepts.map((c, i) => (
                <a
                  key={i}
                  href={`#concept-${i}`}
                  className={`flex items-center gap-2 py-1.5 px-2 rounded-xl text-neutral-700 hover:bg-slate-100 hover:text-slate-900 transition-all text-xs tab-nudge ${fontClass}`}
                >
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800 text-white shrink-0">
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </span>
                  <span className="truncate font-medium">{c.heading}</span>
                </a>
              ))}
            </div>

            <a
              href="#glossary"
              className={`flex items-center gap-2.5 p-2 rounded-xl text-neutral-800 hover:bg-teal-50 hover:text-teal-800 transition-all font-semibold text-xs tab-nudge border border-transparent hover:border-teal-200 ${fontClass}`}
            >
              <Bookmark className="w-4 h-4 text-[#0F766E] shrink-0" />
              <span className="truncate">Key Terms ({notes.glossary.length})</span>
            </a>

            <a
              href="#quiz"
              className={`flex items-center gap-2.5 p-2 rounded-xl text-neutral-800 hover:bg-amber-50 hover:text-amber-800 transition-all font-semibold text-xs tab-nudge border border-transparent hover:border-amber-200 ${fontClass}`}
            >
              <HelpCircle className="w-4 h-4 text-[#D97706] shrink-0" />
              <span className="truncate">Practice Quiz ({notes.revision_questions.length} Qs)</span>
            </a>
          </nav>
        </div>
      )}

      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4.5 shadow-2xs space-y-2 panel-card-anim">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-red-600" />
          <span className={`text-xs font-bold text-neutral-900 uppercase ${fontClass}`}>Study Tip</span>
        </div>
        <p className="font-editorial text-sm text-neutral-700 leading-relaxed italic">
          "Review the key takeaways first, then test yourself with the quiz questions to solidify what you learned."
        </p>
      </div>
    </aside>
  );
};
