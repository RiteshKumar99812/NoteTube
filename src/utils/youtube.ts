import type { LecturePlatform } from '../types/notes';

export interface ParsedLectureSource {
  id: string;
  platform: LecturePlatform;
  url: string;
  displayLabel: string;
}

export function detectLecturePlatform(input: string): LecturePlatform {
  if (!input) return 'web';
  const clean = input.trim().toLowerCase();
  if (clean.includes('coursera.org')) return 'coursera';
  if (clean.includes('udemy.com')) return 'udemy';
  if (clean.includes('edx.org')) return 'edx';
  if (clean.includes('vimeo.com')) return 'vimeo';
  if (clean.includes('loom.com')) return 'loom';
  if (clean.includes('youtu.be') || clean.includes('youtube.com')) return 'youtube';
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return 'youtube';
  return 'web';
}

export function extractYouTubeVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const urlString = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;

    const url = new URL(urlString);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') {
      const id = url.pathname.slice(1).split('/')[0].split('?')[0];
      return id && id.length >= 10 ? id : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        const id = url.searchParams.get('v');
        return id || null;
      }
      const match = url.pathname.match(/^\/(?:embed|v|shorts|live)\/([a-zA-Z0-9_-]{11})/);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch {
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/;
    const match = trimmed.match(regExp);
    return match ? match[1] : null;
  }

  const fallbackMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/);
  return fallbackMatch ? fallbackMatch[1] : null;
}

export function extractLectureSource(input: string): ParsedLectureSource | null {
  if (!input) return null;
  const trimmed = input.trim();
  const platform = detectLecturePlatform(trimmed);

  if (platform === 'youtube') {
    const ytId = extractYouTubeVideoId(trimmed);
    if (!ytId) return null;
    return {
      id: ytId,
      platform: 'youtube',
      url: `https://www.youtube.com/watch?v=${ytId}`,
      displayLabel: `YouTube: ${ytId}`,
    };
  }

  try {
    const urlString = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
    const url = new URL(urlString);

    if (platform === 'coursera') {
      const parts = url.pathname.split('/').filter(Boolean);
      const slug = parts[parts.length - 1] || 'coursera-course';
      return {
        id: slug.slice(0, 32),
        platform: 'coursera',
        url: urlString,
        displayLabel: `Coursera: ${slug}`,
      };
    }

    if (platform === 'udemy') {
      const parts = url.pathname.split('/').filter(Boolean);
      const slug = parts.includes('course')
        ? parts[parts.indexOf('course') + 1] || 'udemy-course'
        : parts[0] || 'udemy-course';
      return {
        id: slug.slice(0, 32),
        platform: 'udemy',
        url: urlString,
        displayLabel: `Udemy: ${slug}`,
      };
    }

    if (platform === 'edx') {
      const parts = url.pathname.split('/').filter(Boolean);
      const slug = parts[parts.length - 1] || 'edx-course';
      return {
        id: slug.slice(0, 32),
        platform: 'edx',
        url: urlString,
        displayLabel: `edX: ${slug}`,
      };
    }

    if (platform === 'vimeo') {
      const match = url.pathname.match(/\/(\d+)/);
      const vid = match ? match[1] : url.pathname.replace(/\//g, '');
      return {
        id: vid || 'vimeo-video',
        platform: 'vimeo',
        url: urlString,
        displayLabel: `Vimeo: ${vid}`,
      };
    }

    if (platform === 'loom') {
      const parts = url.pathname.split('/').filter(Boolean);
      const slug = parts[parts.length - 1] || 'loom-video';
      return {
        id: slug.slice(0, 32),
        platform: 'loom',
        url: urlString,
        displayLabel: `Loom: ${slug}`,
      };
    }

    const host = url.hostname.replace(/^www\./, '');
    const cleanId = (host + url.pathname).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 32);
    return {
      id: cleanId,
      platform: 'web',
      url: urlString,
      displayLabel: `${host}: Lecture`,
    };
  } catch {
    return null;
  }
}

export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function getLectureThumbnailUrl(id: string, platform: LecturePlatform = 'youtube'): string {
  if (platform === 'youtube') {
    return getYouTubeThumbnailUrl(id);
  }
  return `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80`;
}

export function timestampToSeconds(timestamp: string): number {
  if (!timestamp) return 0;
  const cleaned = timestamp.trim().replace(/[\[\]()]/g, '');

  if (/^\d+s?$/.test(cleaned)) {
    return parseInt(cleaned.replace('s', ''), 10);
  }

  const parts = cleaned.split(':').map((p) => parseInt(p, 10));
  if (parts.some(isNaN)) return 0;

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return 0;
}

export function getYouTubeWatchUrl(videoId: string, timestamp?: string): string {
  const baseUrl = `https://www.youtube.com/watch?v=${videoId}`;
  if (!timestamp) return baseUrl;

  const seconds = timestampToSeconds(timestamp);
  return seconds > 0 ? `${baseUrl}&t=${seconds}s` : baseUrl;
}
