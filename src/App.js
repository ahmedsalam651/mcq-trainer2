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
import React, { useState, useEffect } from 'react';
import Quiz from './components/Quiz';
import Upload from './components/Upload';
import QuestionEditor from './components/QuestionEditor';
import Results from './components/Results';
import Retry from './components/Retry';

export default function App() {
  const [view, setView] = useState('quiz');

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  const sendReminder = () => {
    if (Notification.permission === 'granted') {
      new Notification('⏰ Time for your daily quiz!');
    }
  };

  return (
    <div>
      <h1>MCQ PWA</h1>
      <nav>
        <button onClick={() => setView('quiz')}>Quiz</button>
        <button onClick={() => setView('upload')}>Upload</button>
        <button onClick={() => setView('edit')}>Edit</button>
        <button onClick={() => setView('results')}>Results</button>
        <button onClick={() => setView('retry')}>Retry Wrong</button>
        <button onClick={sendReminder}>Send Reminder Now</button>
      </nav>
      {view === 'quiz' && <Quiz />}
      {view === 'upload' && <Upload />}
      {view === 'edit' && <QuestionEditor />}
      {view === 'results' && <Results />}
      {view === 'retry' && <Retry />}
    </div>
  );
}
