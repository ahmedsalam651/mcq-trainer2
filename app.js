
let mcqs = JSON.parse(localStorage.getItem("mcqs") || "[]");
let customMcqs = null;
function showTab(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'score') loadScores();
  if (id === 'manage') showMCQs();
}
function showAddForm() { document.getElementById("addForm").style.display = "block"; }
function addNewMCQ() {
  const newMCQ = {
    q: document.getElementById("newQ").value,
    a: document.getElementById("newA").value,
    b: document.getElementById("newB").value,
    c: document.getElementById("newC").value,
    d: document.getElementById("newD").value,
    correct: document.getElementById("newCorrect").value
  };
  mcqs.push(newMCQ);
  localStorage.setItem("mcqs", JSON.stringify(mcqs));
  showMCQs();
}
function clearAll() {
  localStorage.removeItem("mcqs");
  mcqs = [];
  showMCQs();
}
function startTest() {
  const quizData = customMcqs || mcqs;
  let i = 0, correct = 0, detail = [];
  const quiz = document.getElementById("testArea");
  quiz.innerHTML = "";
  function render() {
    if (i >= quizData.length) {
      let pct = Math.round((correct / quizData.length) * 100);
      let scores = JSON.parse(localStorage.getItem("scores") || "[]");
      scores.push({ correct, total: quizData.length, percent: pct, detail });
      localStorage.setItem("scores", JSON.stringify(scores));
      customMcqs = null;
      quiz.innerHTML = `<h4>Done! ${correct}/${quizData.length} (${pct}%)</h4>`;
      return;
    }
    const q = quizData[i];
    quiz.innerHTML = `<b>Q${i + 1}:</b> ${q.q}<br>
      <button onclick="ans('A')">A. ${q.a}</button>
      <button onclick="ans('B')">B. ${q.b}</button>
      <button onclick="ans('C')">C. ${q.c}</button>
      <button onclick="ans('D')">D. ${q.d}</button>`;
  }
  window.ans = function(letter) {
    const isCorrect = quizData[i].correct.toUpperCase() === letter;
    if (isCorrect) correct++;
    detail.push({ q: quizData[i].q, correct: isCorrect, correctAns: quizData[i].correct,
                   a: quizData[i].a, b: quizData[i].b, c: quizData[i].c, d: quizData[i].d });
    i++;
    render();
  };
  render();
}
function repeatIncorrect(scoreIndex) {
  let scores = JSON.parse(localStorage.getItem("scores") || "[]");
  const score = scores[scoreIndex];
  const incorrect = score.detail.filter(r => !r.correct);
  customMcqs = incorrect.map(r => ({ q: r.q, a: r.a, b: r.b, c: r.c, d: r.d, correct: r.correctAns }));
  showTab('test');
  startTest();
}
function loadScores() {
  const scores = JSON.parse(localStorage.getItem("scores") || "[]");
  document.getElementById("scoreList").innerHTML = scores.map((s, i) =>
    `<li>${s.correct}/${s.total} (${s.percent}%) <button onclick="repeatIncorrect(${i})">Repeat</button></li>`
  ).join("");
}
function showMCQs() {
  document.getElementById("mcqList").innerHTML = mcqs.map((m, i) =>
    `<li>${m.q} <button onclick="editMCQ(${i})">Edit</button></li>`
  ).join("");
}
function editMCQ(i) {
  const m = mcqs[i];
  const el = document.getElementById("mcqList").children[i];
  el.innerHTML = `<input value="${m.q}" id="q${i}">
    <button onclick="saveEdit(${i})">Save</button>`;
}
function saveEdit(i) {
  mcqs[i].q = document.getElementById(`q${i}`).value;
  localStorage.setItem("mcqs", JSON.stringify(mcqs));
  showMCQs();
}
