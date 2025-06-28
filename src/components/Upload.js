import React from 'react';
import pdfParser from '../utils/pdfParser';
import docxParser from '../utils/docxParser';

export default function Upload() {
  const handle = async e => {
    const file = e.target.files[0];
    let newQs = [];
    if (file.type === 'application/pdf') {
      newQs = await pdfParser(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      newQs = await docxParser(file);
    } else return alert('Only PDF or DOCX allowed.');
    
    const existing = JSON.parse(localStorage.getItem('mcqs')||'[]');
    localStorage.setItem('mcqs', JSON.stringify([...existing, ...newQs]));
    alert(`Imported ${newQs.length} questions!`);
  };

  return (
    <div>
      <h2>Upload PDF or DOCX</h2>
      <input type="file" accept=".pdf,.docx" onChange={handle}/>
    </div>
  );
}
