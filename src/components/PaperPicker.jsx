import { PAPERS } from '../lib/papers.js';

export default function PaperPicker({ value, onChange }) {
  return (
    <div className="paper-picker">
      <p className="section-label">Paper</p>
      <div className="picker-options">
        {PAPERS.map((paper, idx) => (
          <button
            key={paper.id}
            className="paper-thumb"
            onClick={() => onChange(idx)}
            aria-pressed={value === idx}
            aria-label={`Paper style ${paper.id}`}
            title={`Paper ${paper.id}`}
          >
            <img src={paper.file} alt={`Paper ${paper.id}`} />
            <span>{paper.id}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
