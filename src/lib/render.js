import { PAPERS, FONTS } from './papers.js';
import { fontsReady } from './fonts.js';

/**
 * Wraps text using the same algorithm as the Python nulis.py prosesText().
 * @param {string} text - Full input text with \n for line breaks
 * @param {number} maxChars - Max chars per line (per-paper, per-font constant)
 * @param {number} maxLines - Max lines on this paper
 * @returns {{ lines: string[], overflow: boolean }}
 */
export function wrapText(text, maxChars, maxLines) {
  const paragraphs = text.split('\n');
  const lines = [];

  for (const para of paragraphs) {
    let remaining = para;
    while (remaining.length > maxChars) {
      lines.push(remaining.slice(0, maxChars));
      remaining = remaining.slice(maxChars);
    }
    lines.push(remaining); // push remainder (even if empty, preserves blank lines)
  }

  return {
    lines,
    overflow: lines.length > maxLines,
  };
}

/**
 * Resolves when the image at src has loaded.
 * @param {string} src
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Renders text onto the paper image on the given canvas.
 * Awaits fontsReady before drawing (Canvas needs fonts loaded).
 * @param {HTMLCanvasElement} canvas
 * @param {{ text: string, nama: string, kelas: string, paperIdx: number, fontIdx: number }} opts
 *   paperIdx: 0-based index into PAPERS
 *   fontIdx: 0-based index into FONTS
 * @returns {Promise<{ lineCount: number, overflow: boolean }>}
 */
export async function renderToCanvas(canvas, { text, nama, kelas, paperIdx, fontIdx }) {
  await fontsReady;

  const paper = PAPERS[paperIdx];
  const font = FONTS[fontIdx];

  // Load paper image
  const img = await loadImage(paper.file);

  // Size canvas to native image resolution
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // Text settings
  ctx.font = `${font.size}px '${font.family}'`;
  ctx.fillStyle = font.color;
  ctx.textBaseline = 'top'; // matches PIL's top-left anchor

  // Draw Nama and Kelas if provided
  if (nama && nama.trim()) {
    ctx.fillText(`Nama : ${nama}`, paper.namaPos.x, paper.namaPos.y);
  }
  if (kelas && kelas.trim()) {
    ctx.fillText(`Kelas : ${kelas}`, paper.kelasPos.x, paper.kelasPos.y);
  }

  // Wrap and draw text lines
  const maxChars = font.maxCharsPerPaper[paperIdx];
  const { lines, overflow } = wrapText(text, maxChars, paper.maxLines);
  const visibleLines = lines.slice(0, paper.maxLines);

  visibleLines.forEach((line, i) => {
    const x = paper.leftMargin;
    const y = paper.topStart + i * paper.lineSpacing;
    ctx.fillText(line, x, y);
  });

  return { lineCount: lines.length, overflow };
}
