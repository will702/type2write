import { FONTS } from '../lib/papers.js';

export default function FontPicker({ value, onChange }) {
  return (
    <div className="font-picker">
      <p className="section-label">Handwriting</p>
      <div className="picker-options">
        {FONTS.map((font, idx) => (
          <button
            key={font.id}
            className="font-swatch"
            onClick={() => onChange(idx)}
            aria-pressed={value === idx}
            aria-label={`Handwriting style ${font.id}`}
          >
            <span className="font-swatch-sample" style={{ fontFamily: font.family }}>
              Aa Bb
            </span>
            <span className="font-swatch-label">Style {font.id}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
