# Nova — Alexa+ Style Experience Prototype

A polished web-based **simulated Alexa+ experience** for the Amazon Developer Hackathon. Nova demonstrates conversational task management, contextual planning, task completion, browser voice input (where supported), and text-to-speech.

> **Important:** Nova is an independent prototype inspired by conversational assistant UX. It is not an official Amazon Alexa+ product and is not connected to Amazon services. Do not represent this as a production Alexa+ integration.

## Features

- Responsive assistant dashboard with task overview and progress.
- Conversational demo commands:
  - `Add prepare slides to my list`
  - `Plan my afternoon`
  - `Summarize my priorities`
  - `What can you help me with?`
- Add, complete, and track tasks in the current page session.
- Browser speech recognition when available; typed input always works.
- Text-to-speech read-aloud when supported by the browser.
- Honest fallbacks when live weather or external services are not configured.
- No API key needed for the local demo.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

To check a production build:

```bash
npm run build
npm run preview
```

## Demo flow (under 3 minutes)

1. Introduce Nova as a simulated conversational assistant (10 seconds).
2. Add a task using the input field (20 seconds).
3. Ask “Plan my afternoon” and show the contextual response (30 seconds).
4. Mark a task complete and show the dashboard progress update (20 seconds).
5. Demonstrate voice input if browser support is available, then use read-aloud (30 seconds).
6. Explain that external integrations are intentionally not connected and show the README/run command (20 seconds).

Record in English. Upload the finished video publicly to YouTube or Vimeo and keep it under three minutes, as required by the event.

## Architecture

- React + Vite single-page frontend.
- Task state and conversational demo logic are implemented in `src/main.jsx`.
- Browser speech recognition and speech synthesis are progressive enhancements.
- No backend, live calendar, live weather, account linking, or real Alexa+ API is connected.

## Track compliance note

This repository implements the **simulated Alexa+ experience** path described in the event brief, rather than a self-hosted MCP server or a production Agent Skill. Verify that Devpost still accepts submissions and review the event's current track instructions before submitting. A working local demo and source code are included, but no project can guarantee selection or a judging score.

## Product feedback draft (verify against your actual testing)

**Tool:** React + Vite web app and browser speech APIs  
**What it was used for:** Prototyping a simulated conversational assistant with task actions, a responsive dashboard, and optional browser voice input/output.  
**What worked well:** Fast local setup, quick iteration, and a straightforward path to a demo without hardware. Browser speech synthesis is easy to demonstrate; voice recognition availability depends on the browser.  
**What needs work:** This prototype does not connect to Alexa+ or Amazon services. Speech recognition support and accuracy vary by browser and environment. A more realistic experience would need a documented Amazon-supported integration or a carefully scoped MCP/Agent Skill implementation.  
**Onboarding experience:** The web stack was familiar and easy to start with; track-specific Amazon onboarding should be evaluated separately if using official Alexa+ tools.  
**Would build with it again:** React + Vite for the simulated web experience; evaluate official Alexa+ integration tools separately before a production integration.  
**AWS services used:** None in this prototype. Do not claim AWS integration unless you add and test one.

## Optional improvement paths

- Persist tasks using local storage.
- Add an LLM provider behind a server-side API route (never commit API keys).
- Add a weather provider with clear attribution and error handling.
- For a different Alexa+ submission path, implement and test an actual MCP server using the event-required protocol/version, or an Agent Skill, and document the integration.

## License

MIT. See `LICENSE`.
