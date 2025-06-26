
let mcqs = JSON.parse(localStorage.getItem("mcqs") || "[]");
if (!mcqs.length && typeof defaultMCQs !== 'undefined') {
  mcqs = defaultMCQs;
  localStorage.setItem("mcqs", JSON.stringify(mcqs));
}
function showTab(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'score') loadScores();
  if (id === 'manage') showMCQs();
}
function startTest() {
  let i = 0, correct = 0;
  const quiz = document.getElementById("testArea");
  function render() {
    if (i >= mcqs.length) {
      let pct = Math.round((correct / mcqs.length) * 100);
      let scores = JSON.parse(localStorage.getItem("scores") || "[]");
      scores.push({ correct, total: mcqs.length, percent: pct });
      localStorage.setItem("scores", JSON.stringify(scores));
      quiz.innerHTML = `<h4>Done! Score: ${correct}/${mcqs.length} = ${pct}%</h4>`;
      return;
    }
    const q = mcqs[i];
    quiz.innerHTML = `<div class="card"><b>Q${i + 1}:</b> ${q.q}<br>
      <button onclick="ans('A')">A. ${q.a}</button><br>
      <button onclick="ans('B')">B. ${q.b}</button><br>
      <button onclick="ans('C')">C. ${q.c}</button><br>
      <button onclick="ans('D')">D. ${q.d}</button></div>`;
  }
  window.ans = function(letter) {
    if (mcqs[i].correct.toUpperCase() === letter) correct++;
    i++; render();
  }
  render();
}
function loadScores() {
  const s = JSON.parse(localStorage.getItem("scores") || "[]");
  document.getElementById("scoreList").innerHTML = s.map(e => `<li>${e.correct}/${e.total} (${e.percent}%)</li>`).join("");
}
function showMCQs() {
  const list = document.getElementById("mcqList");
  list.innerHTML = mcqs.map((m, i) => `<li id="mcq-${i}">
    <b>Q${i + 1}:</b> <span>${m.q}</span><br>
    A: <span>${m.a}</span><br>
    B: <span>${m.b}</span><br>
    C: <span>${m.c}</span><br>
    D: <span>${m.d}</span><br>
    Correct: <span>${m.correct}</span><br>
    <button onclick="editMCQ(${i})">✏️ Edit</button>
  </li>`).join("");
}
function editMCQ(i) {
  const m = mcqs[i];
  const el = document.getElementById(`mcq-${i}`);
  el.innerHTML = `
    <b>Q${i + 1}:</b> <input value="${m.q}" id="q${i}"><br>
    A: <input value="${m.a}" id="a${i}"><br>
    B: <input value="${m.b}" id="b${i}"><br>
    C: <input value="${m.c}" id="c${i}"><br>
    D: <input value="${m.d}" id="d${i}"><br>
    Correct: <input value="${m.correct}" id="corr${i}"><br>
    <button onclick="saveEdit(${i})">💾 Save</button>
  `;
}
function saveEdit(i) {
  mcqs[i] = {
    q: document.getElementById(`q${i}`).value,
    a: document.getElementById(`a${i}`).value,
    b: document.getElementById(`b${i}`).value,
    c: document.getElementById(`c${i}`).value,
    d: document.getElementById(`d${i}`).value,
    correct: document.getElementById(`corr${i}`).value
  };
  localStorage.setItem("mcqs", JSON.stringify(mcqs));
  showMCQs();
}
function clearAll() {
  if (confirm("Delete all saved MCQs?")) {
    localStorage.removeItem("mcqs");
    location.reload();
  }
}
document.addEventListener("DOMContentLoaded", startTest);
