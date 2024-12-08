const todoForm = document.getElementById('todo-form')
const todoInput = document.getElementById('todo-input')
const todoList = document.getElementById('todo-list')

// Initialize the todos from the local storage
document.addEventListener('DOMContentLoaded', loadTodos)

// Submit the form
todoForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const task = todoInput.value.trim()
  if (task) {
    addTodo(task)
    saveToLocalStorage(task)
    todoInput.value = ''
  }
})

// Add task to the DOM
function addTodo(task, isCompleted = false) {
  const li = document.createElement('li')
  li.classList.add('todo-item')
  if (isCompleted) li.classList.add('completed')

  li.innerHTML = `
        <span class='todo-text'>${task}</span>
        <div>
            <button onclick="toggleCompleted(this)">✔</button>
            <button onclick="editTask(this)">🖊</button>
            <button onclick="removeTask(this)">X</button>
        </div>
    `
  todoList.appendChild(li)
}

// Toggle completed
function toggleCompleted(button) {
  const li = button.parentElement.parentElement
  li.classList.toggle('completed')
  updateLocalStorage()
}

// Edit Task

function editTask(button) {
  const li = button.parentElement.parentElement
  const taskText = li.querySelector('.todo-text')
  const originalText = taskText.innerText

  // Replace the task text with the input field for editing

  const input = document.createElement('input')
  input.type = 'text'
  input.value = originalText
  input.classList.add('edit-input')

  //   Replace the task text with the input field

  li.replaceChild(input, taskText)
  input.focus()

  // Handle when the user presses Enter or blurs the input

  input.addEventListener('blur', () => saveEditedTask(input, originalText))
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveEditedTask(input, originalText)
  })
}

function saveEditedTask(input, originalText) {
  const li = input.parentElement
  const newTaskText = input.value.trim()

  if (newTaskText) {
    const taskText = document.createElement('span')
    taskText.classList.add('todo-text')
    taskText.innerText = newTaskText
    li.replaceChild(taskText, input)
    updateLocalStorage()
  } else {
    const taskText = document.createElement('span')
    taskText.classList.add('todo-text')
    taskText.innerText = originalText
    li.replaceChild(taskText, input)
  }
}

// Remove task
function removeTask(button) {
  const li = button.parentElement.parentElement
  li.remove()
  updateLocalStorage()
}

// Load task from local storage
function loadTodos() {
  const tasks = JSON.parse(localStorage.getItem('todos')) || []
  tasks.forEach((task) => addTodo(task.name, task.isCompleted))
}

// Save task to local storage

function saveToLocalStorage(task) {
  const tasks = JSON.parse(localStorage.getItem('todos'))
  tasks.push({ name: task, isCompleted: false })
  localStorage.setItem('todos', JSON.stringify(tasks))
}

function updateLocalStorage() {
  const tasks = Array.from(todoList.children).map((li) => ({
    name: li.querySelector('.todo-text').innerText,
    isCompleted: li.classList.contains('completed'),
  }))
  localStorage.setItem('todos', JSON.stringify(tasks))
}
