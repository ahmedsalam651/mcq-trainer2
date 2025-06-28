import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default async function pdfParser(file) {
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const content = await pdf.getPage(i).then(p => p.getTextContent());
    text += content.items.map(i=>i.str).join(' ') + '\n';
  }
  return splitMCQs(text);
}

function splitMCQs(text) {
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
