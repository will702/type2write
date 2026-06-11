# TypeToWrite

![TypeToWrite Banner](public/banner.png)

Convert typed text into handwritten-looking PNG images on school paper — no pen required.

## What it does

You type your text, pick a paper style and handwriting font, add your name and class, then download a PNG that looks like it was written by hand on lined school paper.

## Tech

- React 18 + Vite
- Canvas API for rendering (no server, all client-side)
- Custom TTF handwriting fonts loaded via `FontFace`
- OKLCH design tokens, Inter + Fraunces

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Build

```bash
npm run build    # output → dist/
npm run preview  # serve the built output locally
```

## Project structure

```
src/
  App.jsx                  # shell layout, shared state
  index.css                # design tokens + all component styles
  components/
    Controls.jsx           # text, name, class inputs + line-count meter
    PaperPicker.jsx        # paper background selector
    FontPicker.jsx         # handwriting font selector
    Preview.jsx            # canvas preview, skeleton, download
  lib/
    papers.js              # paper + font config (margins, line spacing, etc.)
    fonts.js               # FontFace loader
    render.js              # canvas rendering logic
public/
  papers/                  # paper background images (paper1–5.jpg)
  fonts/                   # handwriting TTF files (hand1–3.ttf)
```

## Architecture

### Rendering pipeline

```mermaid
flowchart LR
    A([User types]) --> B["App state\ntext · nama · kelas\npaperIdx · fontIdx"]
    B --> C["Preview.jsx\n150 ms debounce"]
    C --> D["renderToCanvas\nlib/render.js"]
    D --> E{await fontsReady}
    E --> F["loadImage\npaper.file"]
    F --> G[drawImage\npaper background]
    G --> H["fillText\nnama · kelas · lines"]
    H --> I["Copy offscreen\n→ display canvas"]
    I --> J([Preview appears / setReady true])
    J --> K([User clicks Download → PNG saved at full resolution])
```

### Component tree & props

```mermaid
graph TD
    A["App.jsx\n─────────────────\nstate: text · nama · kelas\n       paperIdx · fontIdx\n       renderResult"]
    A -->|"text · nama · kelas\nlineCount · maxLines · overflow\nonChange"| B["Controls.jsx\ntextarea · name/class inputs\nline-count meter · overflow alert"]
    A -->|"value · onChange"| C["PaperPicker.jsx\n5 paper thumbnails"]
    A -->|"value · onChange"| D["FontPicker.jsx\n3 handwriting swatches"]
    A -->|"text · nama · kelas\npaperIdx · fontIdx\nonRenderDone"| E["Preview.jsx\nskeleton · canvas · download btn"]
    E -.->|"onRenderDone({ lineCount, overflow })"| A
```

### State & data flow

```mermaid
flowchart TD
    U([User input])
    U -->|types text| CT["Controls.jsx\ntextarea · name · class inputs\nline-count meter · overflow alert"]
    U -->|picks paper| PP["PaperPicker.jsx\nupdates paperIdx"]
    U -->|picks font| FP["FontPicker.jsx\nupdates fontIdx"]
    CT -->|"onChange → text · nama · kelas"| AS["App state\nsingle source of truth"]
    PP -->|"onChange → paperIdx"| AS
    FP -->|"onChange → fontIdx"| AS
    AS -->|all props| PV["Preview.jsx\ntriggers re-render on change"]
    PV -->|onRenderDone| RR["renderResult\n{ lineCount, overflow }"]
    RR --> AS
    AS -->|"lineCount · maxLines · overflow"| CT
```

### Async rendering sequence

The subtlest part of the codebase — `fontsReady` must resolve before any canvas draw call, and `setReady` gates both the skeleton-to-canvas transition and the download button's enabled state.

```mermaid
sequenceDiagram
    participant U as User
    participant P as Preview.jsx
    participant R as render.js
    participant F as fonts.js
    participant C as Canvas API

    Note over F: App load — fonts resolve once
    F->>F: new FontFace() × 3
    F->>F: face.load() → document.fonts.add()

    U->>P: types or changes any input
    P->>P: debounce 150 ms
    P->>R: renderToCanvas(text, nama, kelas, paperIdx, fontIdx)
    R->>F: await fontsReady
    F-->>R: all fonts available
    R->>C: loadImage(paper.file)
    C-->>R: HTMLImageElement
    R->>C: canvas.width = img.naturalWidth
    R->>C: drawImage(img, 0, 0)
    R->>C: fillText(nama, kelas)
    R->>C: fillText(lines[i]) × N
    R-->>P: return { lineCount, overflow }
    P->>C: copy offscreen → display canvas
    P->>P: setReady(true)
    P-->>U: paper preview visible
```

## How rendering works

1. `fonts.js` loads each TTF via the `FontFace` API and adds it to `document.fonts`.
2. On every input change (150 ms debounce), `render.js` draws the paper image onto a hidden offscreen canvas, then overlays name, class, and wrapped text using the selected font.
3. The result is copied to the visible display canvas (CSS-scaled to fit the viewport).
4. Download saves the offscreen canvas at full native resolution as a PNG.

## Paper / font configuration

Edit `src/lib/papers.js` to adjust per-paper layout values (line spacing, margins, text start position) or add new papers and fonts.

---

Made by Gregorius Willson
