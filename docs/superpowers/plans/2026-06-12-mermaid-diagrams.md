# Mermaid Diagrams Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `## Architecture` section to `README.md` containing 4 Mermaid diagrams that explain the rendering pipeline, component tree, state flow, and async render sequence for developers.

**Architecture:** One new Markdown section inserted between `## Project structure` and `## How rendering works` in `README.md`. No new files, no code changes — documentation only. GitHub renders `mermaid` fenced code blocks natively.

**Tech Stack:** Mermaid diagram syntax, GitHub Markdown

---

### Task 1: Insert the full Architecture section

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Open `README.md` and confirm the insertion point**

Run:
```bash
grep -n "^## How rendering works" README.md
```
Expected: one line like `44:## How rendering works`. Note the line number.

- [ ] **Step 2: Insert the Architecture section**

Using the Edit tool, find this exact string in `README.md`:

```
## How rendering works
```

And replace it with the full block below (keep `## How rendering works` at the end — it stays in the file):

````markdown
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
    J --> K([Download PNG at full resolution])
```

### Component tree & props

```mermaid
graph TD
    A["App.jsx\n─────────────────\nstate: text · nama · kelas\n       paperIdx · fontIdx\n       renderResult"]
    A -->|"text · nama · kelas\nlineCount · maxLines · overflow\nonChange"| B["Controls.jsx\ntextarea · name/class inputs\nline-count meter · overflow alert"]
    A -->|"value · onChange"| C["PaperPicker.jsx\n5 paper thumbnails"]
    A -->|"value · onChange"| D["FontPicker.jsx\n3 handwriting swatches"]
    A -->|"text · nama · kelas\npaperIdx · fontIdx\nonRenderDone"| E["Preview.jsx\nskeleton · canvas · download btn"]
    E -.->|"lineCount · overflow"| A
```

### State & data flow

```mermaid
flowchart TD
    U([User input])
    U -->|types text| CT["Controls.jsx\nupdates text · nama · kelas"]
    U -->|picks paper| PP["PaperPicker.jsx\nupdates paperIdx"]
    U -->|picks font| FP["FontPicker.jsx\nupdates fontIdx"]
    CT --> AS["App state\nsingle source of truth"]
    PP --> AS
    FP --> AS
    AS -->|all props| PV["Preview.jsx\ntriggers re-render on change"]
    PV -->|onRenderDone| RR["renderResult\n{ lineCount, overflow }"]
    RR --> AS
    AS -->|"lineCount · maxLines · overflow"| CT2["Controls.jsx\nshows line meter / overflow alert"]
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
````

---

### Task 2: Verify structure and commit

**Files:**
- Modify: `README.md` (read-only verification)

- [ ] **Step 1: Verify all 4 diagram sections are present**

```bash
grep -n "^### Rendering\|^### Component\|^### State\|^### Async" README.md
```

Expected output (4 lines in this order):
```
XX:### Rendering pipeline
XX:### Component tree & props
XX:### State & data flow
XX:### Async rendering sequence
```

- [ ] **Step 2: Verify overall README heading structure is correct**

```bash
grep -n "^## " README.md
```

Expected output:
```
X:## What it does
X:## Tech
X:## Getting started
X:## Build
X:## Project structure
X:## Architecture
X:## How rendering works
X:## Paper / font configuration
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add Architecture section with 4 Mermaid diagrams"
```
