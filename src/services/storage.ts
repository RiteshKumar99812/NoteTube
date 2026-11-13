import type { SavedNoteRecord } from '../types/notes';

const STORAGE_KEY = 'notetube_saved_notes_v1';
const DEMO_VIDEO_IDS = new Set(['zjkBMFhNj_g', 'r72Bi4nS238', 'jBzwzrD442A', '_uQrJ0TkZlc']);

export function getSavedNotes(): SavedNoteRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const cleaned = parsed.filter(
      (item: SavedNoteRecord) =>
        item &&
        item.id &&
        !item.id.startsWith('seed-') &&
        !item.id.startsWith('sample-') &&
        !DEMO_VIDEO_IDS.has(item.videoId)
    );
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (err) {
    console.error('Failed to read notes from localStorage', err);
    return [];
  }
}

export function saveNoteRecord(record: SavedNoteRecord): SavedNoteRecord[] {
  try {
    if (DEMO_VIDEO_IDS.has(record.videoId)) {
      return getSavedNotes();
    }
    const existing = getSavedNotes();
    const filtered = existing.filter((item) => item.videoId !== record.videoId);
    const updated = [record, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save note to localStorage', err);
    return getSavedNotes();
  }
}

export function deleteSavedNoteRecord(id: string): SavedNoteRecord[] {
  try {
    const existing = getSavedNotes();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete note from localStorage', err);
    return getSavedNotes();
  }
}

export function clearAllSavedNotes(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear notes from localStorage', err);
  }
}
