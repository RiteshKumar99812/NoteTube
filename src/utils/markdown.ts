import type { VideoNotes } from '../types/notes';
import { getYouTubeWatchUrl } from './youtube';

export function formatNotesToMarkdown(notes: VideoNotes, videoId: string): string {
  const lines: string[] = [];
  const platform = notes.platform || 'youtube';

  const sourceUrl =
    platform === 'youtube'
      ? getYouTubeWatchUrl(videoId)
      : platform === 'coursera'
      ? `https://www.coursera.org/learn/${videoId}`
      : platform === 'udemy'
      ? `https://www.udemy.com/course/${videoId}`
      : platform === 'edx'
      ? `https://www.edx.org/course/${videoId}`
      : `https://www.google.com/search?q=${encodeURIComponent(notes.title)}`;

  lines.push(`# ${notes.title}`);
  lines.push('');
  lines.push(`> **Platform**: ${platform.toUpperCase()}`);
  lines.push(`> **Source**: ${sourceUrl}`);
  lines.push(`> **Generated with**: NoteTube Academic Folio`);
  lines.push('');

  lines.push('## Executive Abstract');
  lines.push('');
  lines.push(notes.tldr);
  lines.push('');

  if (notes.short_notes) {
    lines.push('---');
    lines.push('');
    lines.push('## High-Yield Executive Brief');
    lines.push('');
    lines.push(notes.short_notes.executive_brief);
    lines.push('');
    lines.push('### Core Principles');
    notes.short_notes.core_principles.forEach((p) => {
      lines.push(`- ${p}`);
    });
    lines.push('');
    lines.push('### Key Takeaways');
    notes.short_notes.key_takeaways.forEach((t) => {
      lines.push(`- ${t}`);
    });
    lines.push('');
  }

  if (notes.key_concepts && notes.key_concepts.length > 0) {
    lines.push('---');
    lines.push('');
    lines.push('## Key Concepts');
    lines.push('');

    notes.key_concepts.forEach((concept, index) => {
      const tsLink = concept.timestamp && platform === 'youtube'
        ? ` ([${concept.timestamp}](${getYouTubeWatchUrl(videoId, concept.timestamp)}))`
        : concept.timestamp
        ? ` (${concept.timestamp})`
        : '';
      lines.push(`### ${index + 1}. ${concept.heading}${tsLink}`);
      lines.push('');
      concept.bullets.forEach((bullet) => {
        lines.push(`- ${bullet}`);
      });
      lines.push('');
    });
  }

  if (notes.glossary && notes.glossary.length > 0) {
    lines.push('---');
    lines.push('');
    lines.push('## Key Terms & Definitions');
    lines.push('');
    notes.glossary.forEach((item) => {
      lines.push(`- **${item.term}**: ${item.definition}`);
    });
    lines.push('');
  }

  if (notes.revision_questions && notes.revision_questions.length > 0) {
    lines.push('---');
    lines.push('');
    lines.push('## Self-Test Revision Quiz');
    lines.push('');
    notes.revision_questions.forEach((q, idx) => {
      lines.push(`### Question ${idx + 1}: ${q.question}`);
      lines.push('');
      lines.push('<details>');
      lines.push('<summary>Reveal Answer</summary>');
      lines.push('');
      lines.push(q.answer);
      lines.push('</details>');
      lines.push('');
    });
  }

  return lines.join('\n');
}

export function downloadMarkdownFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename.endsWith('.md') ? filename : `${filename}.md`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
