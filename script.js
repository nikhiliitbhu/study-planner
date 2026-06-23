/* ============================================================
   STUDY PLANNER — script.js
   ============================================================ */

/* ── STEP 1: GRAB HTML ELEMENTS ────────────────────────────── */
const taskInput        = document.getElementById('taskInput');
const subjectSelect    = document.getElementById('subjectSelect');
const dueDateInput     = document.getElementById('dueDateInput');
const prioritySelect   = document.getElementById('prioritySelect');
const addBtn           = document.getElementById('addBtn');

const taskList         = document.getElementById('taskList');
const emptyState       = document.getElementById('emptyState');

const filterBtns       = document.querySelectorAll('.filter-btn');
const subjectFilters   = document.getElementById('subjectFilters');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

const progressText     = document.getElementById('progressText');
const progressPercent  = document.getElementById('progressPercent');
const progressFill     = document.getElementById('progressFill');

const statTotal        = document.getElementById('statTotal');
const statDone         = document.getElementById('statDone');
const statPending      = document.getElementById('statPending');
const statOverdue      = document.getElementById('statOverdue');

const daysLeftEl       = document.getElementById('daysLeft');
const darkToggle       = document.getElementById('darkToggle');
const editExamDateBtn  = document.getElementById('editExamDateBtn');
const examDateInput    = document.getElementById('examDateInput');

const STORAGE_KEY = 'study-planner-tasks';
const EXAM_DATE_KEY = 'study-planner-exam-date';
const DEFAULT_EXAM_DATE = '2025-12-15';

/* ── STEP 2: STATE ──────────────────────────────────────────── */
let tasks = loadTasks();
let statusFilter = 'All';
let subjectFilter = 'All';

/* ── STEP 3: PERSISTENCE ───────────────────────────────────── */
function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/* ── STEP 4: ADD A TASK ─────────────────────────────────────── */
function addTask() {
  const name = taskInput.value.trim();
  if (!name) return;

  tasks.push({
    id: Date.now(),
    name,
    subject: subjectSelect.value,
    dueDate: dueDateInput.value,
    priority: prioritySelect.value,
    completed: false
  });

  taskInput.value = '';
  dueDateInput.value = '';

  saveTasks();
  render();
}

/* ── STEP 5: TOGGLE / DELETE A TASK ────────────────────────── */
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  render();
}

/* ── STEP 6: DUE DATE HELPERS ───────────────────────────────── */
function getDueStatus(dueDate) {
  if (!dueDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const diffDays = Math.round((due - today) / 86400000);

  if (diffDays < 0) return 'overdue';
  if (diffDays <= 2) return 'due-soon';
  return null;
}

function formatDueDate(dueDate) {
  return new Date(dueDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}

/* ── STEP 7: BUILD ONE TASK ELEMENT ────────────────────────── */
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.completed ? ' completed' : '');

  const checkbox = document.createElement('div');
  checkbox.className = 'task-checkbox' + (task.completed ? ' checked' : '');
  checkbox.textContent = task.completed ? '✓' : '';
  checkbox.addEventListener('click', () => toggleTask(task.id));

  const body = document.createElement('div');
  body.className = 'task-body';

  const nameEl = document.createElement('p');
  nameEl.className = 'task-name';
  nameEl.textContent = task.name;

  const meta = document.createElement('div');
  meta.className = 'task-meta';

  const subjectBadge = document.createElement('span');
  subjectBadge.className = 'badge-subject';
  subjectBadge.textContent = task.subject;
  meta.appendChild(subjectBadge);

  const priorityBadge = document.createElement('span');
  priorityBadge.className = `badge-priority ${task.priority}`;
  priorityBadge.textContent = task.priority;
  meta.appendChild(priorityBadge);

  if (task.dueDate) {
    const dueStatus = getDueStatus(task.dueDate);
    const dueBadge = document.createElement('span');
    dueBadge.className = 'badge-due' + (dueStatus ? ` ${dueStatus}` : '');
    dueBadge.textContent = `Due ${formatDueDate(task.dueDate)}`;
    meta.appendChild(dueBadge);
  }

  body.appendChild(nameEl);
  body.appendChild(meta);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn-delete';
  deleteBtn.textContent = '🗑️';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));
  actions.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(body);
  li.appendChild(actions);

  return li;
}

/* ── STEP 8: SUBJECT FILTER BUTTONS ────────────────────────── */
function renderSubjectFilters() {
  const subjects = ['All', ...new Set(tasks.map(t => t.subject))];

  subjectFilters.innerHTML = '';
  subjects.forEach(subject => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (subject === subjectFilter ? ' active' : '');
    btn.textContent = subject;
    btn.addEventListener('click', () => {
      subjectFilter = subject;
      render();
    });
    subjectFilters.appendChild(btn);
  });
}

/* ── STEP 9: FILTERING ─────────────────────────────────────── */
function getFilteredTasks() {
  return tasks.filter(task => {
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'active' && !task.completed) ||
      (statusFilter === 'completed' && task.completed);

    const matchesSubject = subjectFilter === 'All' || task.subject === subjectFilter;

    return matchesStatus && matchesSubject;
  });
}

/* ── STEP 10: PROGRESS BAR + STATS ─────────────────────────── */
function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const pending = total - done;
  const overdue = tasks.filter(t => !t.completed && getDueStatus(t.dueDate) === 'overdue').length;

  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  progressText.textContent = `${done} of ${total} tasks done today`;
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;

  statTotal.textContent = total;
  statDone.textContent = done;
  statPending.textContent = pending;
  statOverdue.textContent = overdue;
}

/* ── STEP 11: MAIN RENDER ──────────────────────────────────── */
function render() {
  renderSubjectFilters();

  const filtered = getFilteredTasks();

  taskList.innerHTML = '';
  filtered.forEach(task => taskList.appendChild(createTaskElement(task)));

  emptyState.classList.toggle('visible', tasks.length === 0);

  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === statusFilter);
  });

  updateProgress();
}

/* ── STEP 12: COUNTDOWN TO BOARD EXAM ──────────────────────── */
function getExamDate() {
  return localStorage.getItem(EXAM_DATE_KEY) || DEFAULT_EXAM_DATE;
}

function setExamDate(dateStr) {
  localStorage.setItem(EXAM_DATE_KEY, dateStr);
  updateCountdown();
}

function updateCountdown() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDate = new Date(getExamDate());
  const diffDays = Math.max(0, Math.round((examDate - today) / 86400000));
  daysLeftEl.textContent = diffDays;
}

/* ── STEP 13: DARK MODE ─────────────────────────────────────── */
function initDarkMode() {
  if (localStorage.getItem('study-planner-dark') === 'true') {
    document.body.classList.add('dark');
  }
}

darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('study-planner-dark', document.body.classList.contains('dark'));
});

/* ── STEP 13b: SET EXAM DATE FROM UI ────────────────────────── */
editExamDateBtn.addEventListener('click', () => {
  examDateInput.value = getExamDate();
  examDateInput.classList.add('visible');
  examDateInput.focus();
});

examDateInput.addEventListener('change', () => {
  if (examDateInput.value) setExamDate(examDateInput.value);
  examDateInput.classList.remove('visible');
});

examDateInput.addEventListener('blur', () => {
  examDateInput.classList.remove('visible');
});

/* ── STEP 14: EVENT LISTENERS ───────────────────────────────── */
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') addTask();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    statusFilter = btn.dataset.filter;
    render();
  });
});

clearCompletedBtn.addEventListener('click', clearCompleted);

/* ── STEP 15: INITIAL LOAD ─────────────────────────────────── */
initDarkMode();
updateCountdown();
render();
