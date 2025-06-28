import React, { useState } from 'react';
import Quiz from './components/Quiz';
import Upload from './components/Upload';
import QuestionEditor from './components/QuestionEditor';
import Results from './components/Results';

export default function App() {
  const [view, setView] = useState('quiz');
  return (
    <div className="container">
      <header><h1>MCQ Quiz PWA</h1></header>
      <nav>
        {['quiz','upload','edit','results'].map(v => (
          <button key={v} onClick={() => setView(v)}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </nav>
      <main>
        {view === 'quiz' && <Quiz />}
        {view === 'upload' && <Upload />}
        {view === 'edit' && <QuestionEditor />}
        {view === 'results' && <Results />}
      </main>
    </div>
  );
}
