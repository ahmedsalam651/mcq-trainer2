import React, { useState, useEffect } from 'react';
import { getMCQs, addMCQs } from '../db';

export default function QuestionEditor() {
  const [qs, setQs] = useState([]);

  useEffect(() => {
    getMCQs().then(setQs);
  }, []);

  const save = updated => {
    addMCQs(updated);
    setQs(updated);
  };

  const update = (id, field, val) => {
    const updated = qs.map(q => q.id === id ? { ...q, [field]: val } : q);
    save(updated);
  };

  const del = id => {
    const updated = qs.filter(q => q.id !== id);
    save(updated);
  };

  return (
    <div>
      <h2>Edit Questions</h2>
      {qs.map(q => (
        <div key={q.id} className="editor">
          <textarea
            value={q.question}
            onChange={e => update(q.id, 'question', e.target.value)}
          />
          {q.options.map((o, i) => (
            <input
              key={i}
              value={o.text}
              onChange={e => {
                const newOpts = q.options.map((opt, j) =>
                  j === i ? { ...opt, text: e.target.value } : opt
                );
                update(q.id, 'options', newOpts);
              }}
            />
          ))}
          <button onClick={() => del(q.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
