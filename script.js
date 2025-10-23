/* script.js
   Interactive Demo
   - Event handling for buttons/inputs/links
   - At least 2 interactive features (Task Manager, Live Preview, Theme Toggle)
   - Custom form validation (no built-in HTML constraint UI used — form has novalidate)
   - Each section is commented and organized
*/

/* -----------------------
   Cached DOM references
   ----------------------- */
const body = document.body;
const toggleThemeBtn = document.getElementById('toggle-theme');

const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const clearTasksBtn = document.getElementById('clear-tasks-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');

const signupForm = document.getElementById('signup-form');
const fullname = document.getElementById('fullname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const age = document.getElementById('age');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const formMessage = document.getElementById('form-message');

const previewName = document.getElementById('preview-name');
const previewEmail = document.getElementById('preview-email');
const previewAge = document.getElementById('preview-age');

/* -----------------------
   Small app state
   ----------------------- */
let tasks = []; // holds task objects {id, text}

/* =======================
   Feature A: Theme toggle
   - Event handling for header button to toggle a theme class on the <html> element
   - Demonstrates DOM classList manipulation and text update
   ======================= */
toggleThemeBtn.addEventListener('click', () => {
  // Toggle a class on <body> to switch palettes
  body.classList.toggle('theme-dark');

  // Update button label to reflect state
  if (body.classList.contains('theme-dark')) {
    toggleThemeBtn.textContent = 'Light Theme';
  } else {
    toggleThemeBtn.textContent = 'Dark Theme';
  }
});

/* =======================
   Feature B: Task Manager
   - Add tasks, remove single tasks, clear all
   - Demonstrates event handling for buttons and dynamic DOM creation
   ======================= */

/**
 * renderTasks
 * Renders the tasks array into the DOM.
 */
function renderTasks() {
  // Clear existing list
  taskList.innerHTML = '';

  // Create list items for each task
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;

    const span = document.createElement('span');
    span.textContent = task.text;

    // remove button for each task
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      removeTask(task.id);
    });

    li.appendChild(span);
    li.appendChild(removeBtn);
    taskList.appendChild(li);
  });

  // Update count
  taskCount.textContent = tasks.length;
}

/**
 * addTask
 * Adds a task to the state and re-renders.
 */
function addTask(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return;

  const newTask = {
    id: Date.now().toString(36), // simple unique id
    text: trimmed
  };
  tasks.push(newTask);
  renderTasks();
}

/**
 * removeTask
 * Removes one task by id from the state and re-renders.
 */
function removeTask(taskId) {
  tasks = tasks.filter(t => t.id !== taskId);
  renderTasks();
}

/**
 * clearAllTasks
 * Empties the tasks array and re-renders.
 */
function clearAllTasks() {
  tasks = [];
  renderTasks();
}

/* Event listeners for task controls */
addTaskBtn.addEventListener('click', () => {
  addTask(taskInput.value);
  taskInput.value = '';
  taskInput.focus();
});

clearTasksBtn.addEventListener('click', () => {
  if (tasks.length === 0) return;
  if (!confirm('Clear all tasks?')) return;
  clearAllTasks();
});

// allow pressing Enter in the task input to add
taskInput.addEventListener('keydown', (evt) => {
  if (evt.key === 'Enter') {
    evt.preventDefault();
    addTaskBtn.click();
  }
});

/* =======================
   Feature C: Live Preview
   - As the user types into the form fields, the preview updates in real-time
   - Demonstrates input event handling and DOM textContent updates
   ======================= */
function updatePreview() {
  previewName.textContent = fullname.value.trim() || '—';
  previewEmail.textContent = email.value.trim() || '—';
  previewAge.textContent = age.value.trim() || '—';
}

fullname.addEventListener('input', updatePreview);
email.addEventListener('input', updatePreview);
age.addEventListener('input', updatePreview);

/* Initialize preview with placeholders */
updatePreview();

/* =======================
   Part: Custom Form Validation (no HTML5 validation messages)
   - Validate on submit with JS; prevent submission when invalid
   - Shows inline error messages and a final form message on success
   ======================= */

/**
 * clearErrors
 * Removes all error messages from the form.
 */
function clearErrors() {
  document.querySelectorAll('.error').forEach(el => el.textContent = '');
  formMessage.textContent = '';
  formMessage.style.color = '';
}

/**
 * showError
 * Shows a message in a specific error container.
 */
function showError(fieldId, message) {
  const el = document.getElementById('error-' + fieldId);
  if (el) el.textContent = message;
}

/**
 * validateEmail
 * Simple email pattern check (reasonable, not perfect).
 */
function validateEmail(value) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return pattern.test(value);
}

/**
 * validatePassword
 * Enforces: min 8 chars, at least one uppercase letter and one digit.
 */
function validatePassword(value) {
  if (value.length < 8) return false;
  if (!/[A-Z]/.test(value)) return false;
  if (!/\d/.test(value)) return false;
  return true;
}

/**
 * performValidation
 * Runs all field checks and returns { valid: boolean, data: object }.
 */
function performValidation() {
  clearErrors();
  const data = {
    fullname: fullname.value.trim(),
    email: email.value.trim(),
    password: password.value,
    age: age.value.trim()
  };
  let valid = true;

  // Fullname: at least 3 characters
  if (!data.fullname || data.fullname.length < 3) {
    showError('fullname', 'Please enter your full name (at least 3 characters).');
    valid = false;
  }

  // Email: must match pattern
  if (!data.email || !validateEmail(data.email)) {
    showError('email', 'Please enter a valid email address.');
    valid = false;
  }

  // Password: custom rules
  if (!data.password || !validatePassword(data.password)) {
    showError('password', 'Password must be at least 8 characters, include 1 uppercase letter and 1 digit.');
    valid = false;
  }

  // Age: number between 13 and 120
  const ageNum = Number(data.age);
  if (!data.age || Number.isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
    showError('age', 'Please provide a valid age between 13 and 120.');
    valid = false;
  }

  return { valid, data };
}

/* Submit handler that uses performValidation */
signupForm.addEventListener('submit', (evt) => {
  evt.preventDefault(); // we handle form submission fully via JS

  const { valid, data } = performValidation();

  if (!valid) {
    formMessage.textContent = 'Please fix the errors above and resubmit.';
    formMessage.style.color = 'var(--error, #c62828)';
    return;
  }

  // If valid: simulate submission (e.g., send to server). Here we just show success and clear.
  formMessage.textContent = `Thank you, ${data.fullname}! Your submission was successful.`;
  formMessage.style.color = 'green';

  // Optionally reset form values after success
  signupForm.reset();
  updatePreview();
});

/* Reset button: clear errors and preview, keep default form reset */
resetBtn.addEventListener('click', () => {
  clearErrors();
  signupForm.reset();
  updatePreview();
});

/* =======================
   Extra: keyboard accessibility & initial seed tasks
   - Adds sample tasks on load to demonstrate loop-like initialization
   ======================= */
(function seedInitialTasks() {
  const initial = ['Read docs', 'Try the form', 'Toggle theme'];
  for (let i = 0; i < initial.length; i++) {
    addTask(initial[i]);
  }
})();

/* End of script.js */
