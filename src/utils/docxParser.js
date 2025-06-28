import mammoth from 'mammoth';

export default async function docxParser(file) {
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return splitMCQs(result.value);
}

function splitMCQs(text){ /* same logic as pdfParser.splitMCQs */ 
  const parts = text.split(/Q\./i).slice(1);
  return parts.map(raw => {
    const [q, ...opts] = raw.trim().split(/A\.|B\.|C\.|D\./i);
    return {
      id: Date.now() + Math.random(),
      question: q.trim(),
      options: opts
        .filter(o => o.trim())
        .map((o, i) => ({ label: ['A','B','C','D'][i], text: o.trim() })),
      correct: null
    };
  });
}
