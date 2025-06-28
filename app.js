
console.log('App loaded');
let mcqs = JSON.parse(localStorage.getItem('mcqs') || '[]');
let results = JSON.parse(localStorage.getItem('results') || '[]');

function showMenu(menu) {
  console.log('showMenu called:', menu);
  const content = document.getElementById('content');
  if (!content) {
    console.error('No #content element!');
    return;
  }

  if (menu === 'test') {
    content.innerHTML = '<h2>📝 Test Mode</h2><p>This is the test mode screen.</p><button onclick="startTest()">Start Test</button>';
  } else if (menu === 'manage') {
    content.innerHTML = '<h2>📋 Manage MCQs</h2>' + renderManageScreen();
  } else if (menu === 'results') {
    content.innerHTML = '<h2>📊 Results</h2>' + renderResultsScreen();
  } else if (menu === 'settings') {
    content.innerHTML = `
      <h2>⚙️ Settings</h2>
      <label>Timer (minutes):
        <input id="timerInput" type="number" min="1" value="${localStorage.getItem('timer') || 5}">
      </label>
      <button onclick="saveSettings()">Save</button>
    `;
  } else {
    content.innerHTML = '<h2>Unknown menu</h2>';
  }
}

function startTest() {
  alert('Start test clicked!');
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
    alert('Please fill all fields.');
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
  mcqs = [];
  localStorage.removeItem('mcqs');
  renderMCQList();
}

function renderResultsScreen() {
  if (results.length === 0) return '<p>No results yet.</p>';
  return results.map((r, i) => `<p>Test ${i + 1}: ${r.correct} Correct, ${r.incorrect} Incorrect</p>`).join('');
}

function saveSettings() {
  const timer = document.getElementById('timerInput').value;
  localStorage.setItem('timer', timer);
  alert('Settings saved.');
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded triggered');
  showMenu('test');
});


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').then(() => {
    console.log('Service Worker registered');
  });
}
