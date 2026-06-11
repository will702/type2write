import { useRef, useEffect, useCallback, useState } from 'react';
import { renderToCanvas } from '../lib/render.js';

export default function Preview({ text, nama, kelas, paperIdx, fontIdx, onRenderDone }) {
  const offscreenRef = useRef(null);
  const displayRef   = useRef(null);
  const debounceRef  = useRef(null);

  // True after the first render completes (fonts + image loaded)
  const [ready, setReady] = useState(false);
  // Download feedback flash
  const [saved, setSaved] = useState(false);

  const doRender = useCallback(async () => {
    const offscreen = offscreenRef.current;
    if (!offscreen) return;

    const result = await renderToCanvas(offscreen, { text, nama, kelas, paperIdx, fontIdx });

    // Copy offscreen → display canvas at native resolution
    const display = displayRef.current;
    if (display) {
      display.width  = offscreen.width;
      display.height = offscreen.height;
      const ctx = display.getContext('2d');
      ctx.drawImage(offscreen, 0, 0);
    }

    setReady(true);
    onRenderDone?.(result);
  }, [text, nama, kelas, paperIdx, fontIdx, onRenderDone]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(doRender, 150);
    return () => clearTimeout(debounceRef.current);
  }, [doRender]);

  const handleDownload = () => {
    const offscreen = offscreenRef.current;
    if (!offscreen) return;
    offscreen.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      const now = new Date();
      const pad = n => String(n).padStart(2, '0');
      const ts  = `${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
      a.href     = url;
      a.download = `typetowrite-${ts}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 'image/png');
  };

  const isEmpty = !text.trim();

  return (
    <div className="preview-container">
      {/* Offscreen canvas: full native resolution, always hidden */}
      <canvas ref={offscreenRef} style={{ display: 'none' }} />

      {/* Skeleton shown until first render (fonts + paper image) completes */}
      {!ready && (
        <div
          className="preview-skeleton"
          role="img"
          aria-label="Loading preview…"
        />
      )}

      {/* Display canvas — hidden by CSS until ready */}
      <canvas
        ref={displayRef}
        className={`preview-canvas${!ready ? ' hidden' : ''}`}
        aria-label="Paper preview"
      />

      {/* Empty hint — once ready and text is empty */}
      {ready && isEmpty && (
        <p className="preview-hint">Start typing to see your page</p>
      )}

      <button
        className={`download-btn${saved ? ' saved' : ''}`}
        onClick={handleDownload}
        disabled={isEmpty || !ready}
        aria-label={saved ? 'File saved' : 'Download as PNG'}
      >
        {saved ? 'Saved ✓' : 'Download PNG'}
      </button>
    </div>
  );
}
