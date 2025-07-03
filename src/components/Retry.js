import React, { useState, useEffect } from 'react';
import { getWrong, clearWrong } from '../db';

export default function Retry() {
  const [qs, setQs] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    getWrong().then(setQs);
  }, []);

  if (qs.length === 0) return <p>No wrong questions found! 🎉</p>;

  const choose = label => {
    setAnswers({ ...answers, [index]: label });
  };

  const submit = () => {
    setFinished(true);
    clearWrong();
  };

  if (finished || index >= qs.length) {
    let score = 0;
    qs.forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });
    return (
      <div>
        <h2>Retry Finished!</h2>
        <p>Score: {score} / {qs.length}</p>
      </div>
    );
  }

  const q = qs[index];
  return (
    <div>
      <p>{index + 1}. {q.question}</p>
      {q.options.map(o => (
        <div key={o.label}>
          <label>
            <input
              type="radio"
              checked={answers[index] === o.label}
              onChange={() => choose(o.label)}
            /> {o.label}. {o.text}
          </label>
        </div>
      ))}
      <button onClick={() => setIndex(i => i + 1)}>Next</button>
      <button onClick={submit}>Finish Retry</button>
    </div>
  );
}
