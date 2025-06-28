
console.log('App loaded');
let mcqs = JSON.parse(localStorage.getItem('mcqs') || '[]');
let results = JSON.parse(localStorage.getItem('results') || '[]');
let timer;
let timeLeft;
let currentTest = [];
let currentIndex = 0;
let userAnswers = [];

function showMenu(menu) {
  console.log('showMenu called:', menu);
  const content = document.getElementById('content');

  if (menu === 'test') {
    if (mcqs.length === 0) {
      content.innerHTML = '<h2>📝 Test Mode</h2><p>No MCQs yet. Add some first!</p>';
    } else {
      content.innerHTML = '<h2>📝 Test Mode</h2><p>Shuffle questions?</p><button onclick="startTest(true)">Yes</button> <button onclick="startTest(false)">No</button>';
    }
  } else if (menu === 'manage') {
    content.innerHTML = '<h2>📋 Manage MCQs</h2>' + renderManageScreen();
  } else if (menu === 'results') {
    content.innerHTML = '<h2>📊 Results</h2>' + renderResultsScreen();
  } else if (menu === 'settings') {
    content.innerHTML = `
      <h2>⚙️ Settings</h2>
      <label>Timer (minutes):
        <input id="timerInput" type="number" min="1" value="${localStorage.getItem('timer') || 5}">
      </label><br><br>
      <label>Theme:
        <select id="themeSelect">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label><br><br>
      <button onclick="saveSettings()">Save Settings</button>
    `;
    document.getElementById('themeSelect').value = localStorage.getItem('theme') || 'light';
  } else {
    content.innerHTML = '<h2>Unknown menu</h2>';
  }
}

function startTest(shuffle) {
  currentTest = shuffle ? [...mcqs].sort(() => Math.random() - 0.5) : [...mcqs];
  currentIndex = 0;
  userAnswers = [];
  timeLeft = (parseInt(localStorage.getItem('timer')) || 5) * 60;
  renderQuestion();
  timer = setInterval(countdown, 1000);
}

function countdown() {
  if (timeLeft <= 0) {
    clearInterval(timer);
    finishTest();
  } else {
    timeLeft--;
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById('timer').innerText = '⏳ ' + m + ':' + (s < 10 ? '0' : '') + s;
  }
}

function renderQuestion() {
  if (currentIndex >= currentTest.length) {
    clearInterval(timer);
    finishTest();
    return;
  }
  const mcq = currentTest[currentIndex];
  const content = document.getElementById('content');
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  content.innerHTML = `
    <h3>Q${currentIndex + 1}:</h3>
    <p>${mcq.question}</p>
    <button onclick="selectAnswer('A')">A: ${mcq.options.A}</button><br>
    <button onclick="selectAnswer('B')">B: ${mcq.options.B}</button><br>
    <button onclick="selectAnswer('C')">C: ${mcq.options.C}</button><br>
    <button onclick="selectAnswer('D')">D: ${mcq.options.D}</button>
    <p id="timer">⏳ ${m}:${s < 10 ? '0' : ''}${s}</p>
  `;
}

function selectAnswer(option) {
  userAnswers.push({ selected: option, correct: currentTest[currentIndex].correct });
  currentIndex++;
  renderQuestion();
}

function finishTest() {
  let correct = userAnswers.filter(a => a.selected === a.correct).length;
  let incorrect = userAnswers.length - correct;
  results.push({ correct, incorrect, date: new Date().toLocaleString() });
  localStorage.setItem('results', JSON.stringify(results));
  document.getElementById('content').innerHTML = `<h2>✅ Test Done</h2><p>Correct: ${correct}<br>Incorrect: ${incorrect}</p>`;
}

function renderManageScreen() {
  let html = `
    <div>
      <label>Question:<br><textarea id="questionText"></textarea></label><br>
      <label>Option A: <input id="optionA"></label><br>
      <label>Option B: <input id="optionB"></label><br>
      <label>Option C: <input id="optionC"></label><br>
      <label>Option D: <input id="optionD"></label><br>
      <label>Correct Option:
        <select id="correctOption">
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </label><br>
      <button onclick="saveMCQ()">Save MCQ</button>
      <button onclick="removeAllMcqs()">Remove All</button>
    </div>
    <hr>
    <div id="mcqList"></div>
  `;
  setTimeout(renderMCQList, 0);
  return html;
}

function saveMCQ() {
  const q = document.getElementById('questionText').value;
  const a = document.getElementById('optionA').value;
  const b = document.getElementById('optionB').value;
  const c = document.getElementById('optionC').value;
  const d = document.getElementById('optionD').value;
  const correct = document.getElementById('correctOption').value;

  if (!q || !a || !b || !c || !d) {
    alert('Fill all fields.');
    return;
  }

  mcqs.push({ question: q, options: { A: a, B: b, C: c, D: d }, correct });
  localStorage.setItem('mcqs', JSON.stringify(mcqs));
  showMenu('manage');
}

function renderMCQList() {
  const list = document.getElementById('mcqList');
  if (!list) return;
  if (mcqs.length === 0) {
    list.innerHTML = '<p>No MCQs saved.</p>';
    return;
  }
  let html = '';
  mcqs.forEach((mcq, i) => {
    html += `<div class="mcq-card">
      <b>Q:</b> ${mcq.question}<br>
      A: ${mcq.options.A}<br>
      B: ${mcq.options.B}<br>
      C: ${mcq.options.C}<br>
      D: ${mcq.options.D}<br>
      Correct: ${mcq.correct}<br>
      <button onclick="deleteMCQ(${i})">Delete</button>
    </div>`;
  });
  list.innerHTML = html;
}

function deleteMCQ(i) {
  mcqs.splice(i, 1);
  localStorage.setItem('mcqs', JSON.stringify(mcqs));
  renderMCQList();
}

function removeAllMcqs() {
  if (confirm('Are you sure you want to remove all MCQs?')) {
    mcqs = [];
    localStorage.removeItem('mcqs');
    renderMCQList();
  }
}

function renderResultsScreen() {
  if (results.length === 0) return '<p>No results yet.</p>';
  return results.map((r, i) => `<p>Test ${i + 1}: ${r.correct} ✅, ${r.incorrect} ❌</p>`).join('');
}

function saveSettings() {
  const timer = document.getElementById('timerInput').value;
  const theme = document.getElementById('themeSelect').value;
  localStorage.setItem('timer', timer);
  localStorage.setItem('theme', theme);
  applyTheme();
  alert('Settings saved.');
}

function applyTheme() {
  document.body.className = (localStorage.getItem('theme') === 'dark') ? 'dark' : '';
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
  applyTheme();
  showMenu('test');
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js');
}
