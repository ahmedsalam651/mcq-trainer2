import React, { useState, useEffect } from 'react';

export default function QuestionEditor() {
  const [qs, setQs] = useState([]);
  useEffect(() => setQs(JSON.parse(localStorage.getItem('mcqs')||'[]')), []);
  const save = arr => {
    localStorage.setItem('mcqs', JSON.stringify(arr));
    setQs(arr);
  };
  
  const update = (id, field, val) => {
    save(qs.map(q => q.id===id ? { ...q, [field]: val } : q));
  };

  const del = id => {
    if (confirm('Delete?')) save(qs.filter(q=>q.id!==id));
  };

  return (
    <div>
      <h2>Edit Questions</h2>
      {qs.length===0 && <p>No questions yet.</p>}
      {qs.map(q=>(
        <div key={q.id} className="editor">
          <input 
            value={q.question} 
            onChange={e=>update(q.id,'question',e.target.value)}
          />
          <div className="opts">
            {q.options.map((o,i)=>(
              <input
                key={i}
                value={o.text}
                onChange={e=>{
                  const newOpts = q.options.map((opt,j)=>j===i?{...opt,text:e.target.value}:opt);
                  update(q.id,'options',newOpts);
                }}
              />
            ))}
          </div>
          <button onClick={()=>del(q.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
