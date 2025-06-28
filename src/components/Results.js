import React, { useState, useEffect } from 'react';

export default function Results() {
  const [res, setRes] = useState([]);
  useEffect(() => setRes(JSON.parse(localStorage.getItem('results')||'[]')), []);
  return (
    <div>
      <h2>Past Results</h2>
      {res.length===0 && <p>No attempts yet.</p>}
      <ul>
        {res.map((r,i)=>(
          <li key={i}>
            {new Date(r.date).toLocaleString()}: {r.score}/{r.total} (wrong: {r.wrong.join(', ')})
          </li>
        ))}
      </ul>
    </div>
  );
}
