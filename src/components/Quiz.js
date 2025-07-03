import React, { useState, useEffect } from 'react';
import { getMCQs, saveResult, saveWrong } from '../db';

export default function Quiz() {
  const [qs, setQs] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(60);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    getMCQs().then(setQs);

    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          setFinished(true);
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const choose = label => {
    setAnswers({ ...answers, [index]: label });
  };

  const submit = () => {
    setFinished(true);
  };

  if (qs.length === 0) return <p>No questions found. Please upload MCQs first!</p>;

  if (finished || index >= qs.length) {
    let wrongQs = [];
    let score = 0;

    qs.forEach((q, i) => {
      if (answers[i] === q.correct) {
        score++;
      } else {
        wrongQs.push(q);
      }
    });

    saveResult({
      date: new Date().toISOString(),
      score,
      total: qs.length,
    });

    saveWrong(wrongQs);

    return (
      <div>
        <h2>Quiz Finished!</h2>
        <p>Score: {score} / {qs.length}</p>
        <p>{wrongQs.length} wrong answers saved for retry.</p>
        <button onClick={() => window.location.reload()}>Take Another Quiz</button>
      </div>
    );
  }

  const q = qs[index];
  return (
    <div>
      <h3>Time left: {timer}s</h3>
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
      <button onClick={submit}>Finish</button>
    </div>
  );
}
