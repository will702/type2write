# Mermaid Diagrams for README.md

**Date:** 2026-06-12
**Status:** Approved

## Goal

Add 4 Mermaid diagrams to `README.md` so developers can quickly understand the architecture, component relationships, and the async rendering pipeline before touching the code.

## Audience

Developers who want to fork, contribute to, or learn from the codebase.

## What gets added

A new `## Architecture` section inserted after `## Project structure` and before `## How rendering works`, containing 4 Mermaid diagrams in order:

### 1. Rendering Pipeline (flowchart LR)

Traces the full path from user input to a downloadable PNG:

- User types → App state → Preview.jsx debounce (150 ms) → `renderToCanvas` → `await fontsReady` → `loadImage` → `drawImage` (paper bg) → `fillText` (nama, kelas, lines) → copy offscreen → display canvas → `setReady(true)` → Download PNG

### 2. Component Tree with Props (graph TD)

Shows the 4 child components hanging off `App.jsx`, the props each receives, and the `onRenderDone` callback that flows back up from `Preview` to update `renderResult` in App state.

### 3. State & Data Flow (flowchart TD)

Shows how user interactions in `Controls`, `PaperPicker`, and `FontPicker` all converge into a single App state, then fan back out — Preview triggers a re-render, returns `renderResult`, which loops back to update the Controls line-count meter / overflow alert.

### 4. Async Rendering Sequence (sequenceDiagram)

The most non-obvious part of the codebase. Shows:
- `fonts.js` runs `FontFace.load()` × 3 once on app load
- Every input change triggers a 150 ms debounce in `Preview.jsx`
- `renderToCanvas` awaits `fontsReady` before touching the canvas
- Image load → drawImage → fillText → copy offscreen → display
- `setReady(true)` gates the skeleton → canvas reveal and the download button enable state

## Placement in README.md

```
## Project structure   (existing)
## Architecture        ← NEW section with all 4 diagrams
## How rendering works (existing — kept as prose complement to the sequence diagram)
## Paper / font configuration (existing)
```

## Verification

Open the README on GitHub (or run `grip` / a local Markdown preview) and confirm all 4 diagrams render as expected — no raw Mermaid source visible, no broken syntax.
