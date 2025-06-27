
let mcqs = JSON.parse(localStorage.getItem('mcqs') || '[]');

function showManage() {
  const content = document.getElementById('content');
  let html = `
    <h2>Manage MCQs (Minimal)</h2>
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
  `;
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
  renderMCQList();
}

function renderMCQList() {
  const list = document.getElementById('mcqList');
  if (mcqs.length === 0) {
    list.innerHTML = '<p>No MCQs saved.</p>';
    return;
  }
  let html = '';
  mcqs.forEach((mcq, index) => {
    html += `
      <div class="mcq-card">
        <strong>Q:</strong> ${mcq.question}<br>
        A: ${mcq.options.A}<br>
        B: ${mcq.options.B}<br>
        C: ${mcq.options.C}<br>
        D: ${mcq.options.D}<br>
        <strong>Correct:</strong> ${mcq.correct}<br>
        <button onclick="editMCQ(${index})">Edit</button>
        <button onclick="deleteMCQ(${index})">Delete</button>
      </div>
    `;
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

function removeAllMcqs() {
  mcqs = [];
  localStorage.removeItem('mcqs');
  renderMCQList();
}

document.addEventListener('DOMContentLoaded', () => {
  showManage();
});
