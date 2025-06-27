let mcqs = JSON.parse(localStorage.getItem("mcqs") || "[]");
let imported = [];

function showTab(id) {
  document.querySelectorAll('.tab').forEach(t => t.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  if (id === 'manage') showMCQs();
}

async function importPDF() {
  const file = document.getElementById('pdfFile').files[0];
  if (!file) { alert("Choose a PDF!"); return; }
  const reader = new FileReader();
  reader.onload = async () => {
    const typedarray = new Uint8Array(reader.result);
    const pdf = await pdfjsLib.getDocument(typedarray).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(it => it.str).join(' ') + "\\n";
    }
    parseText(text);
  };
  reader.readAsArrayBuffer(file);
}

function parseText(text) {
  const lines = text.split(/\\n|\\r/);
  imported = [];
  let current = {};
  lines.forEach(line => {
    line = line.trim();
    if (/^\\d+\\./.test(line)) { if (current.q) imported.push(current); current = { q: line, a:'', b:'', c:'', d:'', correct:'' }; }
    else if (/^A\\./.test(line)) current.a = line;
    else if (/^B\\./.test(line)) current.b = line;
    else if (/^C\\./.test(line)) current.c = line;
    else if (/^D\\./.test(line)) current.d = line;
    else if (/Correct/i.test(line)) current.correct = line.split(/:|\\s/).pop();
  });
  if (current.q) imported.push(current);
  document.getElementById("preview").innerHTML = imported.map(
    m => `<div><b>${m.q}</b><br>${m.a}<br>${m.b}<br>${m.c}<br>${m.d}<br>Correct: ${m.correct}</div><hr>`
  ).join("");
}

function saveImported() {
  mcqs = mcqs.concat(imported);
  localStorage.setItem("mcqs", JSON.stringify(mcqs));
  alert("Saved!");
}

function showMCQs() {
  document.getElementById("mcqList").innerHTML = mcqs.map(m => `<li>${m.q}</li>`).join("");
}

function startTest() {
  alert("Start test logic goes here.");
}