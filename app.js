
let mcqs = JSON.parse(localStorage.getItem("mcqs") || "[]");
let customMcqs = null;

function showTab(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'score') loadScores();
  if (id === 'manage') showMCQs();
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
      quiz.innerHTML = `<h4>Done! Score: ${correct}/${quizData.length} (${pct}%)</h4>`;
      return;
    }
    const q = quizData[i];
    quiz.innerHTML = `<div class="card"><b>Q${i + 1}:</b> ${q.q}<br>
      <button onclick="ans('A')">A. ${q.a}</button><br>
      <button onclick="ans('B')">B. ${q.b}</button><br>
      <button onclick="ans('C')">C. ${q.c}</button><br>
      <button onclick="ans('D')">D. ${q.d}</button></div>`;
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
  if (!incorrect.length) {
    alert("No incorrect questions to repeat.");
    return;
  }
  customMcqs = incorrect.map(r => ({ q: r.q, a: r.a, b: r.b, c: r.c, d: r.d, correct: r.correctAns }));
  showTab('test');
  startTest();
}

function loadScores() {
  const scores = JSON.parse(localStorage.getItem("scores") || "[]");
  const list = document.getElementById("scoreList");
  list.innerHTML = scores.map((score, i) => {
    let qList = '';
    if (score.detail) {
      qList = '<ul style="background:#f0f0f0;padding:10px;border-radius:8px">';
      score.detail.forEach((r, idx) => {
        const symbol = r.correct ? '✅' : '❌';
        qList += `<li>${symbol} Q${idx + 1}: ${r.q}</li>`;
      });
      qList += '</ul>';
    }
    return `<li style="margin-bottom:15px;">
      <b>Score ${i + 1}:</b> ${score.correct}/${score.total} (${score.percent}%)<br>
      <button onclick="repeatIncorrect(${i})">🔁 Repeat Incorrect</button>
    </li>` + qList;
  }).join("");
}

function showMCQs() {
  const list = document.getElementById("mcqList");
  list.innerHTML = mcqs.map((m, i) => `
    <li id="mcq-${i}" style="margin-bottom:15px;">
      <b>Q${i + 1}:</b> ${m.q}<br>
      A: ${m.a}<br>
      B: ${m.b}<br>
      C: ${m.c}<br>
      D: ${m.d}<br>
      Correct: ${m.correct}<br>
      <button onclick="editMCQ(${i})">✏️ Edit</button>
    </li>
  `).join("");
}

function editMCQ(i) {
  const m = mcqs[i];
  const el = document.getElementById(`mcq-${i}`);
  el.innerHTML = `
    <b>Q${i + 1}:</b> <input value="${m.q}" id="q${i}" style="width:100%;"><br>
    A: <input value="${m.a}" id="a${i}" style="width:100%;"><br>
    B: <input value="${m.b}" id="b${i}" style="width:100%;"><br>
    C: <input value="${m.c}" id="c${i}" style="width:100%;"><br>
    D: <input value="${m.d}" id="d${i}" style="width:100%;"><br>
    Correct: <input value="${m.correct}" id="corr${i}" style="width:100%;"><br>
    <button onclick="saveEdit(${i})" style="background:#4caf50;color:white;padding:6px 12px;border:none;border-radius:4px;">💾 Save</button>
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
