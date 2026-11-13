export type LecturePlatform = 'youtube' | 'coursera' | 'udemy' | 'edx' | 'vimeo' | 'loom' | 'web';

export type NoteSynthesisStyle = 'full' | 'short' | 'revision';

export interface ConceptSection {
  heading: string;
  timestamp?: string;
  bullets: string[];
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface QuizItem {
  question: string;
  answer: string;
}

export interface ShortNotesPayload {
  executive_brief: string;
  key_takeaways: string[];
  core_principles: string[];
  quick_lexicon: GlossaryItem[];
}

export interface VideoNotes {
  title: string;
  tldr: string;
  platform?: LecturePlatform;
  key_concepts: ConceptSection[];
  glossary: GlossaryItem[];
  revision_questions: QuizItem[];
  short_notes?: ShortNotesPayload;
}

export interface SavedNoteRecord {
  id: string;
  videoId: string;
  videoUrl: string;
  platform?: LecturePlatform;
  noteStyle?: NoteSynthesisStyle;
  savedAt: string;
  notes: VideoNotes;
}

export interface GenerateNotesRequest {
  video_id: string;
  platform?: LecturePlatform;
  style?: NoteSynthesisStyle;
}
