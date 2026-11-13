import { jsPDF } from 'jspdf';
import type { VideoNotes } from '../types/notes';

export function generateNotesPdf(notes: VideoNotes, videoId: string): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const platform = notes.platform || 'youtube';

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 20) {
      doc.addPage();
      y = margin + 15;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`NoteTube Study Folio — ${notes.title.substring(0, 50)}...`, margin, margin - 10);
      doc.setDrawColor(230, 230, 230);
      doc.line(margin, margin - 5, pageWidth - margin, margin - 5);
    }
  };

  doc.setFillColor(220, 38, 38);
  doc.rect(margin, y, 4, 22, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(220, 38, 38);
  doc.text('NOTETUBE ACADEMIC GUIDE', margin + 10, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`${platform.toUpperCase()} Ref: ${videoId}  |  Generated on ${new Date().toLocaleDateString()}`, margin + 10, y + 21);

  y += 38;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39);
  const titleLines = doc.splitTextToSize(notes.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 22 + 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Platform: ${platform.toUpperCase()} | Source ID: ${videoId}`, margin, y);
  y += 18;

  doc.setDrawColor(229, 231, 235);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  checkPageBreak(80);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text('EXECUTIVE TL;DR SUMMARY', margin, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const tldrLines = doc.splitTextToSize(notes.tldr, contentWidth - 20);
  const tldrBoxHeight = tldrLines.length * 14 + 16;

  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, y, contentWidth, tldrBoxHeight, 4, 4, 'FD');

  doc.setTextColor(55, 65, 81);
  doc.text(tldrLines, margin + 10, y + 15);
  y += tldrBoxHeight + 20;

  if (notes.short_notes) {
    checkPageBreak(70);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(220, 38, 38);
    doc.text('HIGH-YIELD EXECUTIVE BRIEF', margin, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    const briefLines = doc.splitTextToSize(notes.short_notes.executive_brief, contentWidth);
    doc.text(briefLines, margin, y);
    y += briefLines.length * 13 + 12;
  }

  if (notes.key_concepts && notes.key_concepts.length > 0) {
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text('KEY CONCEPTS & CHRONOLOGICAL FOUNDATIONS', margin, y);
    y += 16;

    notes.key_concepts.forEach((concept, index) => {
      checkPageBreak(60);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(17, 24, 39);

      const headingText = `${index + 1}. ${concept.heading}`;
      doc.text(headingText, margin, y);

      if (concept.timestamp) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(220, 38, 38);
        doc.text(`[${concept.timestamp}]`, pageWidth - margin - 35, y);
      }
      y += 14;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(55, 65, 81);

      concept.bullets.forEach((bullet) => {
        const bulletLines = doc.splitTextToSize(bullet, contentWidth - 18);
        checkPageBreak(bulletLines.length * 14 + 6);
        doc.text('•', margin + 6, y);
        doc.text(bulletLines, margin + 18, y);
        y += bulletLines.length * 13 + 5;
      });

      y += 8;
    });

    y += 12;
  }

  if (notes.glossary && notes.glossary.length > 0) {
    checkPageBreak(60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text('KEY TERMS & GLOSSARY', margin, y);
    y += 16;

    notes.glossary.forEach((item) => {
      checkPageBreak(40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(17, 24, 39);
      doc.text(`• ${item.term}:`, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);

      const defLines = doc.splitTextToSize(item.definition, contentWidth - 15);
      doc.text(defLines, margin + 12, y + 12);
      y += defLines.length * 13 + 14;
    });

    y += 12;
  }

  if (notes.revision_questions && notes.revision_questions.length > 0) {
    checkPageBreak(60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text('SELF-TEST REVISION QUIZ', margin, y);
    y += 16;

    notes.revision_questions.forEach((q, idx) => {
      checkPageBreak(60);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(17, 24, 39);
      const qLines = doc.splitTextToSize(`Q${idx + 1}: ${q.question}`, contentWidth);
      doc.text(qLines, margin, y);
      y += qLines.length * 13 + 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(55, 65, 81);
      const aLines = doc.splitTextToSize(`Answer: ${q.answer}`, contentWidth - 12);
      doc.text(aLines, margin + 12, y);
      y += aLines.length * 13 + 12;
    });
  }

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, pageHeight - margin + 10, pageWidth - margin, pageHeight - margin + 10);
    doc.text('NoteTube — Structured Academic Lecture Notes', margin, pageHeight - margin + 22);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 40, pageHeight - margin + 22);
  }

  const cleanTitle = notes.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `notetube-${videoId}`;
  doc.save(`${cleanTitle}.pdf`);
}
