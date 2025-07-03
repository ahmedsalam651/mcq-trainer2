import React, { useState, useEffect } from 'react';
import { getResults } from '../db';

export default function Results() {
  const [res, setRes] = useState([]);

  useEffect(() => {
    getResults().then(setRes);
  }, []);

  return (
    <div>
      <h2>Past Results</h2>
      {res.length === 0 && <p>No attempts yet.</p>}
      <ul>
        {res.map((r, i) => (
          <li key={i}>
            {new Date(r.date).toLocaleString()}: {r.score} / {r.total}
          </li>
        ))}
      </ul>
    </div>
  );
}
