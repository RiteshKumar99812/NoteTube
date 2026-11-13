# NoteTube — YouTube to Structured Study Notes

A clean, modern, editorial light-themed React + TypeScript + Tailwind CSS frontend that converts YouTube lectures into structured study notes.

Inspired by everyday productivity tools like **Notion**, **Readwise**, and **Linear's light mode**, NoteTube emphasizes readability, typography, and clear visual hierarchy without distracting neon gradients or purple AI tropes.

---

## 🎨 Design System & Palette

- **Backgrounds**: Pure white (`#FFFFFF`) and warm off-white (`#FAFAFA`)
- **Borders**: Subtle slate/neutral gray (`#E5E7EB`)
- **Primary Text**: Deep charcoal (`#111827`)
- **Secondary Text**: Muted slate (`#4B5563`)
- **Single Accent Color**: Clean YouTube crimson red (`#DC2626` / hover `#B91C1C`)
- **Typography**: Plus Jakarta Sans (UI) & JetBrains Mono (timestamps & IDs)
- **Icons**: Clean outline icons via `lucide-react`
- **Zero Prohibited Styles**: Strictly no purple, violet, indigo, or neon gradients.

---

## ⚡ Features

1. **Top Navigation Bar**:
   - Minimalist white navbar with subtle border.
   - NoteTube brand mark with crimson play emblem.
   - **"History / Saved Notes"** toggle with dynamic count badge opening a slide-over drawer.
   - "Sample Notes" instant preview button and "New Video" reset action.

2. **Hero & Video URL Detection**:
   - Wide prominent input bar with **Paste** (from clipboard), **Clear (X)**, and crimson **Generate Notes** button.
   - Real-time YouTube video ID extractor supporting all formats (`youtube.com/watch?v=...`, `youtu.be/...`, shorts, embeds, and raw 11-char IDs).
   - Instant compact video preview card displaying the official YouTube thumbnail (`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`), video ID badge, and link to YouTube.
   - Realistic multi-step loading skeleton state during synthesis.

3. **Structured Notes Output View (Main Workspace)**:
   - **Sticky Action Toolbar**:
     - **Copy Markdown** button with an interactive `Copied!` confirmation state.
     - **Download .md** button exporting the document as a clean `.md` file for Notion, Obsidian, or local markdown readers.
     - **Share** and **Reset / New Video** actions.
   - **Document Header**:
     - Clean, readable H1 title.
     - Source video badge with YouTube external link.
     - Reading time estimation and topic count.
     - Light gray / warm-tinted **TL;DR Executive Summary** callout box.
   - **Key Concepts Section**:
     - Chronological concept cards with clear headings and crisp bullet points.
     - Clickable timestamp badges (e.g., `04:15`) in neutral gray pills that jump directly to `https://www.youtube.com/watch?v=${videoId}&t=${seconds}s` in a new tab.
   - **Key Terms & Glossary**:
     - Two-column grid of key vocabulary with clear term headers and definitions.
   - **Self-Test Revision Quiz**:
     - Accordion cards with questions and interactive **"Reveal Answer"** / **"Hide Answer"** toggles.
     - **"Reveal All / Hide All"** toggle.

4. **Slide-over History Drawer**:
   - Persists generated notes in `localStorage`.
   - Card previews with thumbnails, titles, timestamps, and one-click loading.
   - Ability to delete single notes or clear all history.

5. **API Integration & Fallback Mock Mode**:
   - Configured to `POST` to `http://localhost:8000/api/generate-notes` with body `{ "video_id": "..." }`.
   - Built-in instant **Sample Notes** loader for curated lectures (Andrej Karpathy's LLMs, Harvard CS50, Stanford CS229 ML).
   - If FastAPI is offline or not yet started, displays a connection banner with a one-click button to preview and test the complete UI layout with mock data.

---

## 📐 TypeScript Data Schema

The data structures strictly match the requested JSON interface:

```ts
interface ConceptSection {
  heading: string;
  timestamp?: string;
  bullets: string[];
}

interface GlossaryItem {
  term: string;
  definition: string;
}

interface QuizItem {
  question: string;
  answer: string;
}

interface VideoNotes {
  title: string;
  tldr: string;
  key_concepts: ConceptSection[];
  glossary: GlossaryItem[];
  revision_questions: QuizItem[];
}
```

---

## 🚀 Getting Started

### Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
npm run build
npm run preview
```
