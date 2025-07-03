import React from 'react';
import pdfParser from '../utils/pdfParser';
import docxParser from '../utils/docxParser';
import { addMCQs } from '../db';

export default function Upload() {
  const handleFile = async e => {
    const file = e.target.files[0];
    let questions = [];

    if (file.type === 'application/pdf') {
      questions = await pdfParser(file);
    } else if (file.name.endsWith('.docx')) {
      questions = await docxParser(file);
    } else {
      alert('Unsupported file type');
      return;
    }

    await addMCQs(questions);
    alert(`Imported ${questions.length} questions!`);
  };

  return (
    <div>
      <h2>Upload MCQs (PDF or DOCX)</h2>
      <input type="file" onChange={handleFile} />
    </div>
  );
}
