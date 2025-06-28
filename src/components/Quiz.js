import React, { useState, useEffect } from 'react';

export default function Quiz() {
  const [qs, setQs] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(60);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const arr = JSON.parse(localStorage.getItem('mcqs')||'[]');
    setQs(arr);
    const t = setInterval(()=>setTimer(t=>t>0?t-1:t),1000);
    return ()=>clearInterval(t);
  }, []);

  useEffect(() => {
    if (timer===0) setFinished(true);
  }, [timer]);

  const choose = label => setAnswers({...answers, [index]:label});
  const submit = () => setFinished(true);
  if (qs.length===0) return <p>No questions: add some!</p>;

  if (finished || index >= qs.length) {
    const score = qs.reduce((s,q,i)=> (answers[i]===q.correct ? s+1 : s),0);
    const stored = JSON.parse(localStorage.getItem('results')||'[]');
    stored.push({ date: new Date(), score, total: qs.length, wrong: Object.keys(answers).filter(i=>answers[i]!==qs[i].correct) });
    localStorage.setItem('results', JSON.stringify(stored));
    return (
      <div>
        <h2>Results</h2>
        <p>Score: {score}/{qs.length}</p>
        <button onClick={()=>{setIndex(0);setAnswers({});setTimer(60);setFinished(false);}}>Retry</button>
      </div>
    );
  }

  const q = qs[index];
  return (
    <div>
      <h2>Time left: {timer}s</h2>
      <p>{index+1}. {q.question}</p>
      {q.options.map(o=>(
        <div key={o.label}>
          <label>
            <input type="radio" name="opt" checked={answers[index]===o.label} onChange={()=>choose(o.label)} /> {o.label}. {o.text}
          </label>
        </div>
      ))}
      <button onClick={()=>setIndex(i=>i+1)}>Next</button>
      <button onClick={submit}>Finish</button>
    </div>
  );
}
