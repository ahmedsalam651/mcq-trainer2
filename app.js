
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
  list.innerHTML = mcqs.map((m, i) => `<li><b>${m.q}</b><br>A: ${m.a}<br>B: ${m.b}<br>C: ${m.c}<br>D: ${m.d}<br>Correct: ${m.correct}</li>`).join("");
}
function clearAll() {
  if (confirm("Delete all saved MCQs?")) {
    localStorage.removeItem("mcqs");
    location.reload();
  }
}
document.addEventListener("DOMContentLoaded", startTest);
