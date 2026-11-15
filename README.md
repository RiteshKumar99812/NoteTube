# NoteTube

I watch a lot of lectures on YouTube and I'm bad at taking notes while watching. So I built this. You paste a link, and it gives you proper study notes: a short summary, the main concepts with timestamps you can click, a small glossary, and a few quiz questions to test yourself afterwards.

The frontend is React + TypeScript + Tailwind. The backend is FastAPI with PostgreSQL (migrations with Alembic).

Status: the frontend is finished and works on its own with sample notes. The backend is the part I'm building right now.

## What it does

You paste a YouTube link (or just the video ID) and it figures out the video from any of the usual formats: normal links, youtu.be, shorts, embeds. It shows the thumbnail so you know it picked the right one, then generates the notes.

The notes page has:

- a TL;DR at the top
- key concepts in the order they come up in the video, each with a timestamp that opens YouTube at that exact second
- a glossary of the important terms
- revision questions where you try to answer first and then reveal the answer

You can copy the notes as Markdown or download them as a `.md` file, which is handy for Notion or Obsidian. Past notes are saved in a side drawer so you can open them again later.

If the API isn't running, the app tells you and lets you load some sample notes (Karpathy's LLM lecture, CS50, Stanford CS229) so you can still see how everything looks.

## Running it

You need Node 20 or newer.

```
git clone <this repo>
cd notegen
npm install
npm run dev
```

Then open http://localhost:5173.

Other scripts:

```
npm run build
npm run preview
npm run lint
```

## How the backend works

The frontend sends a POST request to `http://localhost:8000/api/generate-notes` with the video ID:

```json
{ "video_id": "dQw4w9WgXcQ" }
```

The backend fetches the transcript, sends it to an LLM with a fixed JSON schema, checks the result with Pydantic, and returns it. Finished notes are stored in PostgreSQL by video ID, so the same video doesn't need to be processed twice.

The response looks like this:


interface VideoNotes {
  title: string;
  tldr: string;
  key_concepts: {
    heading: string;
    timestamp?: string;  
    bullets: string[];
  }[];
  glossary: { term: string; definition: string }[];
  revision_questions: { question: string; answer: string }[];
}
```

## Folders

```
src/            frontend code
public/         static files
index.html
vite.config.ts
```

The backend will go in its own `backend/` folder next to the frontend.

## Design

I wanted it to look like a reading tool and not a flashy AI demo. White and off-white backgrounds, grey borders, dark text, and one red accent that matches YouTube. Plus Jakarta Sans for the interface and JetBrains Mono for timestamps. No gradients.

## Ideas for later

- Show progress while the notes are being generated
- Export to PDF
- Read the API URL from an environment variable instead of hardcoding it
- Keyboard shortcuts

## Notes

If something breaks or you have an idea, open an issue. I haven't added a license yet.