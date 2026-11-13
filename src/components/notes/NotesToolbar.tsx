import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  RotateCcw,
  BookmarkCheck,
  FileDown,
  Printer,
} from 'lucide-react';
import type { VideoNotes } from '../../types/notes';
import { formatNotesToMarkdown, downloadMarkdownFile } from '../../utils/markdown';
import { generateNotesPdf } from '../../utils/pdf';

interface NotesToolbarProps {
  notes: VideoNotes;
  videoId: string;
  onReset: () => void;
}

export const NotesToolbar: React.FC<NotesToolbarProps> = ({
  notes,
  videoId,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const handleCopyMarkdown = async () => {
    try {
      const markdown = formatNotesToMarkdown(notes, videoId);
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy markdown', err);
    }
  };

  const handleDownloadMarkdown = () => {
    const markdown = formatNotesToMarkdown(notes, videoId);
    const sanitizedTitle =
      notes.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `notetube-${videoId}`;
    downloadMarkdownFile(`${sanitizedTitle}.md`, markdown);
  };

  const handleDownloadPdf = () => {
    setPdfGenerating(true);
    try {
      generateNotesPdf(notes, videoId);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setTimeout(() => setPdfGenerating(false), 800);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="sticky top-16 z-20 -mx-6 sm:-mx-10 lg:-mx-14 px-6 sm:px-10 lg:px-14 py-3 bg-white border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 no-print rounded-t-3xl transition-all">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-2 text-xs font-bold text-neutral-800 bg-neutral-100 px-3.5 py-1.5 rounded-full border border-neutral-200 shadow-2xs">
          <BookmarkCheck className="w-3.5 h-3.5 text-red-600" />
          <span>Note Saved to Vault</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleDownloadPdf}
          disabled={pdfGenerating}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 border border-red-700 rounded-full shadow-md shadow-red-600/25 transition-all duration-200 cursor-pointer btn-spring"
          title="Download study notes as a formatted academic PDF document"
        >
          {pdfGenerating ? (
            <span>Generating PDF...</span>
          ) : (
            <>
              <FileDown className="w-3.5 h-3.5 text-white" />
              <span>Download PDF</span>
            </>
          )}
        </button>

        <button
          onClick={handleCopyMarkdown}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold rounded-full border transition-all duration-200 shadow-sm shadow-slate-900/20 cursor-pointer btn-spring ${
            copied
              ? 'bg-emerald-700 text-white border-emerald-800'
              : 'bg-[#1E293B] text-white hover:bg-slate-900 border-slate-900'
          }`}
          title="Copy formatted Markdown notes to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-200" />
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
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold text-white bg-[#0F766E] hover:bg-teal-800 border border-teal-800 rounded-full shadow-sm shadow-teal-900/20 transition-all duration-200 cursor-pointer btn-spring"
          title="Download as clean Markdown file"
        >
          <Download className="w-3.5 h-3.5 text-teal-200" />
          <span>Download .md</span>
        </button>

        <button
          onClick={handlePrint}
          className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold text-white bg-[#D97706] hover:bg-amber-700 border border-amber-800 rounded-full shadow-sm shadow-amber-900/20 transition-all duration-200 cursor-pointer btn-spring"
          title="Print or Save via Browser Print Dialog"
        >
          <Printer className="w-3.5 h-3.5 text-amber-100" />
          <span>Print</span>
        </button>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold text-neutral-800 hover:text-red-700 bg-neutral-100 hover:bg-red-50 border border-neutral-300 hover:border-red-300 rounded-full transition-all duration-200 cursor-pointer btn-spring"
          title="Clear current notes and transcribe another video"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Video</span>
        </button>
      </div>
    </div>
  );
};
