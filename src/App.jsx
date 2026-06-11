import { useState } from 'react';
import './index.css';
import Controls from './components/Controls.jsx';
import PaperPicker from './components/PaperPicker.jsx';
import FontPicker from './components/FontPicker.jsx';
import Preview from './components/Preview.jsx';
import { PAPERS } from './lib/papers.js';

function App() {
  const [text, setText] = useState('');
  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('');
  const [paperIdx, setPaperIdx] = useState(0);
  const [fontIdx, setFontIdx] = useState(0);
  const [renderResult, setRenderResult] = useState({ lineCount: 0, overflow: false });

  const handleChange = (field, value) => {
    if (field === 'text') setText(value);
    else if (field === 'nama') setNama(value);
    else if (field === 'kelas') setKelas(value);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">TypeToWrite</h1>
        <p className="app-tagline">Ketik teks kamu, jadikan tulisan tangan</p>
      </header>

      <main className="app-main">
        <section className="controls-panel">
          <Controls
            text={text} nama={nama} kelas={kelas}
            overflow={renderResult.overflow}
            lineCount={renderResult.lineCount}
            maxLines={PAPERS[paperIdx].maxLines}
            onChange={handleChange}
          />
          <PaperPicker value={paperIdx} onChange={setPaperIdx} />
          <FontPicker value={fontIdx} onChange={setFontIdx} />
        </section>

        <section className="preview-panel">
          <Preview
            text={text} nama={nama} kelas={kelas}
            paperIdx={paperIdx} fontIdx={fontIdx}
            onRenderDone={setRenderResult}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>TypeToWrite — web refactored · Gregorius Willson</p>
      </footer>
    </div>
  );
}

export default App;
