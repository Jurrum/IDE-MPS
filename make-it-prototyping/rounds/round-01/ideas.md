# Round 01 — Prototype Ideas

This document proposes candidate prototypes for Round 1, aligned with your Learning Focus in the root README:

- Front-end (web) development — creative coding and clarity in communicating prototype purpose (likely React)
- Build a simple Neural Network — e.g., image recognition from scratch/re-creation
- Relational Databases — design + use (e.g., PostgreSQL)
- Higher-level Digital Prototyping — orchestration (MCP), light agents/automation (n8n/Make/Zapier)

Each idea below follows a recipe-first approach and can be annotated for the IDE Prototyping Cookbook.

---

## Idea A — React + p5.js Creative Sketch (Interactive Generative Art)
- What: Build a small React app that embeds a p5.js sketch (or canvas) with parameters controlled via UI (sliders, toggles). Export images/gifs to `assets/`.
- Why: Fast feedback, highly visual, builds front-end discipline and communication clarity. Great for documenting “what/why/how”.
- Recipe Source: IDE Cookbook “React + p5 starter” or a well-known tutorial on integrating p5 with React (placeholder link).
- Scope:
  - React app with a single page and a clearly stated prototype goal
  - One sketch that reacts to 2–3 parameters (e.g., color palette, motion speed, density)
  - Button to export a static image
- Success Criteria:
  - Runs locally with a clear README quick-start (install, run)
  - Demo GIF(s) in `assets/`
  - Short reflection on what makes the interaction meaningful
- Stretch Goals:
  - Add record-to-GIF in-browser
  - Allow saving/restoring parameter presets via URL query params
- Env/Tools: Node.js, React (Vite/CRA), p5.js; optional canvas recorder lib
