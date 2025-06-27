
let mcqs = JSON.parse(localStorage.getItem('mcqs') || '[]');
let results = JSON.parse(localStorage.getItem('results') || '[]');
let currentTest = [];
let currentIndex = 0;
let userAnswers = [];
let timer;
let timeLeft;

function showMenu(menu) {
  const content = document.getElementById('content');
  if (menu === 'test') {
    if (mcqs.length === 0) {
      content.innerHTML = '<p>No MCQs available. Please add some first!</p>';
      return;
    }
    content.innerHTML = '<h2>Start Test</h2><button onclick="startTest()">Start Now</button>';
  } else if (menu === 'manage') {
    renderManageScreen();
  } else if (menu === 'results') {
    renderResultsScreen();
  } else if (menu === 'settings') {
    content.innerHTML = \`
      <h2>Settings</h2>
      <label>Timer (minutes): 
        <input id="timerInput" type="number" min="1" value="\${localStorage.getItem('timer') || 5}">
      </label><br><br>
      <label>Theme: 
        <select id="themeSelect">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label><br><br>
      <button onclick="saveSettings()">Save Settings</button>
    \`;
    document.getElementById('themeSelect').value = localStorage.getItem('theme') || 'light';
  }
}

function startTest() {
  currentTest = [...mcqs].sort(() => Math.random() - 0.5);
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
    document.getElementById('timer').innerText = 'Time left: ' + timeLeft + 's';
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
  content.innerHTML = \`
    <h2>Question \${currentIndex + 1}</h2>
    <p>\${mcq.question}</p>
    <button onclick="selectAnswer('A')">A: \${mcq.options.A}</button><br>
    <button onclick="selectAnswer('B')">B: \${mcq.options.B}</button><br>
    <button onclick="selectAnswer('C')">C: \${mcq.options.C}</button><br>
    <button onclick="selectAnswer('D')">D: \${mcq.options.D}</button>
    <p id="timer">Time left: \${timeLeft}s</p>
  \`;
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
  const content = document.getElementById('content');
  content.innerHTML = \`
    <h2>Test Finished!</h2>
    <p>Correct: \${correct}</p>
    <p>Incorrect: \${incorrect}</p>
  \`;
}

function renderManageScreen() {
  const content = document.getElementById('content');
  let html = \`
    <h2>Manage MCQs</h2>
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
    </div>
    <hr>
    <div id="mcqList"></div>
    <button onclick="removeAllMcqs()">Remove All MCQs</button>
  \`;
  content.innerHTML = html;
  renderMCQList();
}

function saveMCQ() {
  const question = document.getElementById('questionText').value;
  const optionA = document.getElementById('optionA').value;
  const optionB = document.getElementById('optionB').value;
  const optionC = document.getElementById('optionC').value;
  const optionD = document.getElementById('optionD').value;
  const correct = document.getElementById('correctOption').value;

  if (!question || !optionA || !optionB || !optionC || !optionD) {
    alert('Please fill all fields.');
    return;
  }

  const mcq = { question, options: { A: optionA, B: optionB, C: optionC, D: optionD }, correct };
  mcqs.push(mcq);
  localStorage.setItem('mcqs', JSON.stringify(mcqs));
  renderManageScreen();
}

function renderMCQList() {
  const list = document.getElementById('mcqList');
  if (mcqs.length === 0) {
    list.innerHTML = '<p>No MCQs saved.</p>';
    return;
  }
  let html = '';
  mcqs.forEach((mcq, index) => {
    html += \`
      <div class="mcq-card">
        <strong>Q:</strong> \${mcq.question}<br>
        A: \${mcq.options.A}<br>
        B: \${mcq.options.B}<br>
        C: \${mcq.options.C}<br>
        D: \${mcq.options.D}<br>
        <strong>Correct:</strong> \${mcq.correct}<br>
        <button onclick="editMCQ(\${index})">Edit</button>
        <button onclick="deleteMCQ(\${index})">Delete</button>
      </div>
    \`;
  });
  list.innerHTML = html;
}

function editMCQ(index) {
  const mcq = mcqs[index];
  document.getElementById('questionText').value = mcq.question;
  document.getElementById('optionA').value = mcq.options.A;
  document.getElementById('optionB').value = mcq.options.B;
  document.getElementById('optionC').value = mcq.options.C;
  document.getElementById('optionD').value = mcq.options.D;
  document.getElementById('correctOption').value = mcq.correct;
  mcqs.splice(index, 1);
  localStorage.setItem('mcqs', JSON.stringify(mcqs));
  renderMCQList();
}

function deleteMCQ(index) {
  mcqs.splice(index, 1);
  localStorage.setItem('mcqs', JSON.stringify(mcqs));
  renderMCQList();
}

function renderResultsScreen() {
  const content = document.getElementById('content');
  let html = '<h2>Results</h2>';
  if (results.length === 0) {
    html += '<p>No results yet.</p>';
  } else {
    results.forEach((r, i) => {
      html += `<p>Test ${i + 1} — ${r.date}: ${r.correct} Correct, ${r.incorrect} Incorrect</p>`;
    });
  }
  html += '<br><button onclick="clearResults()">Clear All Results</button>';
  content.innerHTML = html;
}

function removeAllMcqs() {
  mcqs = [];
  localStorage.removeItem('mcqs');
  renderMCQList();
}

function clearResults() {
  results = [];
  localStorage.removeItem('results');
  renderResultsScreen();
}

function saveSettings() {
  const timer = document.getElementById('timerInput').value;
  const theme = document.getElementById('themeSelect').value;
  localStorage.setItem('timer', timer);
  localStorage.setItem('theme', theme);
  applyTheme();
  alert('Settings saved!');
}

function applyTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  document.body.className = theme === 'dark' ? 'dark' : '';
}

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  showMenu('test');
});
