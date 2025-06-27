
let mcqs = JSON.parse(localStorage.getItem("mcqs") || "[]");
let customMcqs = null;

function showTab(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'score') loadScores();
  if (id === 'manage') showMCQs();
  if (id === 'settings') loadSettings();
}

function showAddForm() {
  document.getElementById("addForm").style.display = "block";
}

function addNewMCQ() {
  const newMCQ = {
    q: document.getElementById("newQ").value,
    a: document.getElementById("newA").value,
    b: document.getElementById("newB").value,
    c: document.getElementById("newC").value,
    d: document.getElementById("newD").value,
    correct: document.getElementById("newCorrect").value,
    tag: document.getElementById("newTag").value,
    fav: false
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

function searchMCQs() {
  const term = document.getElementById("searchBox").value.toLowerCase();
  showMCQs(term);
}

function showMCQs(term="") {
  document.getElementById("mcqList").innerHTML = mcqs.map((m, i) => {
    if (!m.q.toLowerCase().includes(term) && !m.tag.toLowerCase().includes(term)) return '';
    return `<li><b>${m.q}</b><br>Tag: ${m.tag} ${m.fav ? '⭐️' : ''}<br>
    <button onclick="toggleFav(${i})">${m.fav ? 'Remove ⭐️' : 'Mark ⭐️'}</button></li>`;
  }).join("");
}

function toggleFav(i) {
  mcqs[i].fav = !mcqs[i].fav;
  localStorage.setItem("mcqs", JSON.stringify(mcqs));
  showMCQs();
}

function startTest() {
  let quizData = [...mcqs];
  if (document.getElementById("shuffleQuestions").checked) {
    quizData = quizData.sort(() => Math.random() - 0.5);
  }
  const num = parseInt(document.getElementById("mcqCount").value);
  if (num > 0 && num < quizData.length) quizData = quizData.slice(0, num);
  quizData.forEach(q => {
    const options = [q.a, q.b, q.c, q.d];
    q.shuffled = options.sort(() => Math.random() - 0.5);
  });
  customMcqs = quizData;
  runTest();
}

function runTest() {
  const quizData = customMcqs || mcqs;
  let i = 0, correct = 0;
  const quiz = document.getElementById("testArea");
  const progress = document.getElementById("progressBar");

  function render() {
    progress.innerHTML = `<progress value="${i}" max="${quizData.length}"></progress>`;
    if (i >= quizData.length) {
      let pct = Math.round((correct / quizData.length) * 100);
      quiz.innerHTML = `<h4>Done! ${correct}/${quizData.length} (${pct}%)</h4>`;
      return;
    }
    const q = quizData[i];
    quiz.innerHTML = `<b>Q${i + 1}:</b> ${q.q}<br>` + q.shuffled.map(opt =>
      `<button onclick="ans('${['A','B','C','D'][q.shuffled.indexOf(opt)]}')">${opt}</button><br>`).join("");
  }

  window.ans = function(letter) {
    const isCorrect = quizData[i].correct.toUpperCase() === letter;
    if (isCorrect) correct++;
    i++;
    render();
  };

  render();
}

function saveSettings() {
  const t = document.getElementById("timeSetting").value;
  localStorage.setItem("testTime", t);
  alert("Settings Saved!");
}

function loadSettings() {
  const t = localStorage.getItem("testTime") || "5";
  document.getElementById("timeSetting").value = t;
}

function clearScores() {
  localStorage.removeItem("scores");
  alert("Scores cleared.");
}

function loadScores() {
  document.getElementById("scoreList").innerHTML = "<li>Score details coming soon</li>";
}
