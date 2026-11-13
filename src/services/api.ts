import type { VideoNotes, GenerateNotesRequest } from '../types/notes';
import { SAMPLE_NOTES } from '../data/sampleNotes';

export const BACKEND_API_URL = 'http://localhost:8000/api/generate-notes';

export interface ApiError {
  isNetworkError: boolean;
  status?: number;
  message: string;
}

export async function generateNotesFromApi(
  videoId: string,
  signal?: AbortSignal
): Promise<{ data?: VideoNotes; error?: ApiError }> {
  const payload: GenerateNotesRequest = { video_id: videoId };

  try {
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal,
    });

    if (!response.ok) {
      let errorDetail = `Server responded with status ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson && (errorJson.detail || errorJson.message)) {
          errorDetail = errorJson.detail || errorJson.message;
        }
      } catch {}

      return {
        error: {
          isNetworkError: false,
          status: response.status,
          message: errorDetail,
        },
      };
    }

    const data: VideoNotes = await response.json();
    return { data };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        error: {
          isNetworkError: false,
          message: 'Request was cancelled.',
        },
      };
    }

    const message =
      err instanceof Error
        ? err.message
        : 'Failed to connect to backend server at http://localhost:8000';

    return {
      error: {
        isNetworkError: true,
        message,
      },
    };
  }
}

export async function generateMockNotes(
  videoId: string,
  simulatedDelayMs: number = 1000
): Promise<VideoNotes> {
  if (simulatedDelayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, simulatedDelayMs));
  }

  const matchedSample = SAMPLE_NOTES.find((item) => item.videoId === videoId);
  if (matchedSample) {
    return matchedSample.notes;
  }

  return {
    title: `Comprehensive Lecture Notes (${videoId})`,
    tldr: `This lecture explores core conceptual foundations, step-by-step methodology, and practical applications. The discussion outlines primary mechanisms, operational trade-offs, and critical considerations for students and practitioners.`,
    short_notes: {
      executive_brief: `Core principles and high-yield insights for ${videoId}. Key focus on conceptual decomposition, practical execution invariants, and real-world system tradeoffs.`,
      key_takeaways: [
        'System architecture balances throughput against latency bounds.',
        'Algorithmic foundations dictate scalability limits under load.',
        'Operational metrics provide early detection of regression anomalies.'
      ],
      core_principles: [
        'Principle of Locality & Separation of Concerns',
        'Asymptotic Bound Guarantee: O(log n) efficiency',
        'Idempotent Execution Model'
      ],
      quick_lexicon: [
        { term: 'Invariance', definition: 'Property that remains unchanged after transformations.' },
        { term: 'Throughput', definition: 'Rate of successful message or computation completion.' }
      ]
    },
    key_concepts: [
      {
        heading: 'Foundational Theory & Problem Definition',
        timestamp: '02:30',
        bullets: [
          'Deconstructs the historical context and initial problem framing.',
          'Highlights fundamental constraints and why earlier methodologies proved inadequate.',
          'Establishes key terminology and mathematical or logical prerequisites.',
        ],
      },
      {
        heading: 'Primary Architecture & Analytical Mechanics',
        timestamp: '14:15',
        bullets: [
          'Dives into the core mechanisms that drive this system or framework.',
          'Walks through concrete examples demonstrating input-to-output transformation.',
          'Analyzes boundary edge cases and failure modes.',
        ],
      },
      {
        heading: 'Practical Optimization & Real-World Applications',
        timestamp: '28:45',
        bullets: [
          'Compares empirical performance against industry benchmarks.',
          'Discusses trade-offs between implementation simplicity and operational scale.',
          'Synthesizes best practices for applied problem solving in production settings.',
        ],
      },
    ],
    glossary: [
      {
        term: 'First Principles',
        definition: 'Foundational propositions that cannot be deduced from any other proposition or assumption.',
      },
      {
        term: 'Trade-off Analysis',
        definition: 'Systematic comparison of competing advantages and disadvantages when choosing between alternatives.',
      },
      {
        term: 'Latency Bound',
        definition: 'The maximum tolerable delay between a stimulus input and its corresponding output response.',
      },
    ],
    revision_questions: [
      {
        question: 'What is the primary architectural bottleneck identified in the opening discussion?',
        answer: 'The primary bottleneck stems from exponential resource consumption when scaling linear approaches, requiring algorithmic restructuring and caching.',
      },
      {
        question: 'How do the authors mitigate edge-case vulnerabilities under peak load?',
        answer: 'By introducing asynchronous queue decoupling, circuit breakers, and bounded retry policies with exponential backoff.',
      },
    ],
  };
}
