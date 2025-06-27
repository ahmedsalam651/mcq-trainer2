
let mcqs = JSON.parse(localStorage.getItem('mcqs') || '[]');
let results = JSON.parse(localStorage.getItem('results') || '[]');

// Show the selected menu
function showMenu(menu) {
  const content = document.getElementById('content');
  if (menu === 'test') {
    content.innerHTML = `
      <h2>Start Test</h2>
      <button onclick="startTest()">Start</button>
    `;
  } else if (menu === 'manage') {
    content.innerHTML = `
      <h2>Manage MCQs</h2>
      <button onclick="removeAllMcqs()">Remove All MCQs</button>
      <button onclick="removeAllResults()">Remove All Results</button>
    `;
  } else if (menu === 'results') {
    let html = '<h2>Results</h2>';
    if (results.length === 0) {
      html += '<p>No results yet.</p>';
    } else {
      results.forEach((r, i) => {
        html += `<p>Test ${i + 1}: ${r.correct} Correct, ${r.incorrect} Incorrect</p>`;
      });
    }
    content.innerHTML = html;
  } else if (menu === 'settings') {
    content.innerHTML = `
      <h2>Settings</h2>
      <label>Timer (minutes): 
        <input id="timerInput" type="number" min="1" value="${localStorage.getItem('timer') || 5}">
      </label>
      <button onclick="saveSettings()">Save</button>
    `;
  }
}

// Functions for buttons
function startTest() {
  alert('Here you would implement the test logic!');
}

function removeAllMcqs() {
  mcqs = [];
  localStorage.removeItem('mcqs');
  alert('All MCQs removed.');
}

function removeAllResults() {
  results = [];
  localStorage.removeItem('results');
  alert('All results removed.');
}

function saveSettings() {
  const timer = document.getElementById('timerInput').value;
  localStorage.setItem('timer', timer);
  alert('Settings saved!');
}

// Show default menu on load
document.addEventListener('DOMContentLoaded', () => {
  showMenu('test');
});

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js');
}
