export default function Controls({ text, nama, kelas, overflow, lineCount, maxLines, onChange }) {
  return (
    <div className="controls">
      {/* Text field */}
      <div className="field">
        <label className="field-label" htmlFor="ctrl-text">Text</label>
        <textarea
          id="ctrl-text"
          className="text-input"
          placeholder="Ketik teks di sini… (Type your text here)"
          value={text}
          onChange={e => onChange('text', e.target.value)}
          rows={8}
        />
        {text.trim() && (
          <p className={`line-meter${overflow ? ' overflow' : ''}`} aria-live="polite">
            {lineCount} / {maxLines} lines
          </p>
        )}
      </div>

      {/* Identity */}
      <div className="identity-section">
        <p className="section-label">Identity</p>
        <div className="field-row">
          <div className="field">
            <label className="field-label" htmlFor="ctrl-nama">Name</label>
            <input
              id="ctrl-nama"
              className="short-input"
              type="text"
              placeholder="Your name"
              value={nama}
              onChange={e => onChange('nama', e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="ctrl-kelas">Class</label>
            <input
              id="ctrl-kelas"
              className="short-input"
              type="text"
              placeholder="Your class"
              value={kelas}
              onChange={e => onChange('kelas', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Overflow alert */}
      {overflow && (
        <div className="overflow-alert" role="alert">
          Text exceeds the page limit ({lineCount} lines, max {maxLines}). Lines past the limit may be cut off.
        </div>
      )}
    </div>
  );
}
