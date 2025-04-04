// Retrieve from localStorage or use default empty array
const todoList = JSON.parse(localStorage.getItem('todos')) || [];

renderTodoList();
updateStats();

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todoList));
}

function renderTodoList() {
  let todoListHTML = '';

  if (todoList.length === 0) {
    document.querySelector('.js-empty-state').style.display = 'block';
    document.querySelector('.js-todo-list').innerHTML = '';
    return;
  }
  
  document.querySelector('.js-empty-state').style.display = 'none';

  // Check if we're on mobile
  const isMobile = window.innerWidth <= 600;

  todoList.forEach((todoObject, index) => {
    const { name, dueDate } = todoObject;
    
    // Different HTML structure based on screen size
    let html;
    
    if (isMobile) {
      html = `
        <div class="todo-item" data-index="${index}">
          <div class="todo-name">${name}</div>
          <div class="todo-date">${formatDate(dueDate)}</div>
          <button class="delete-todo-button js-delete-todo-button" aria-label="Delete task">
            <i class="fas fa-trash-alt"></i> Delete
          </button> 
        </div>
      `;
    } else {
      html = `
        <div class="todo-item" data-index="${index}">
          <div class="todo-name">${name}</div>
          <div class="todo-date">${formatDate(dueDate)}</div>
          <button class="delete-todo-button js-delete-todo-button" aria-label="Delete task">
            <i class="fas fa-trash-alt"></i>
          </button> 
        </div>
      `;
    }
    
    todoListHTML += html;
  });

  document.querySelector('.js-todo-list').innerHTML = todoListHTML;

  document.querySelectorAll('.js-delete-todo-button')
    .forEach((deleteButton) => {
      deleteButton.addEventListener('click', (event) => {
        const todoItem = event.target.closest('.todo-item');
        const index = parseInt(todoItem.dataset.index);
        
        // Add a fade-out animation
        todoItem.style.opacity = '0';
        todoItem.style.transition = 'opacity 0.3s';
        
        setTimeout(() => {
          todoList.splice(index, 1);
          saveTodos();
          renderTodoList();
          updateStats();
        }, 300);
      });
    });
}

// Re-render on resize to handle mobile/desktop layout changes
window.addEventListener('resize', () => {
  renderTodoList();
});

function formatDate(dateString) {
  if (!dateString) return 'No date';
  
  const options = { month: 'short', day: 'numeric' };
  
  // If not mobile, add the weekday
  if (window.innerWidth > 600) {
    options.weekday = 'short';
  }
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

function updateStats() {
  const statsElement = document.querySelector('.js-todo-stats');
  statsElement.textContent = `${todoList.length} task${todoList.length !== 1 ? 's' : ''}`;
}

document.querySelector('.js-add-todo-button')
  .addEventListener('click', () => {
    addTodo();
  });

// Add keyboard support for the input field
document.querySelector('.js-name-input')
  .addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  });

document.querySelector('.js-clear-all-button')
  .addEventListener('click', () => {
    if (todoList.length === 0) return;
    
    if (confirm('Are you sure you want to clear all tasks?')) {
      todoList.length = 0;
      saveTodos();
      renderTodoList();
      updateStats();
    }
  });

function addTodo() {
  const inputElement = document.querySelector('.js-name-input');
  const name = inputElement.value.trim();

  if (!name) {
    // Highlight the input field if empty
    inputElement.style.borderColor = '#e63946';
    inputElement.classList.add('shake');
    
    setTimeout(() => {
      inputElement.style.borderColor = '';
      inputElement.classList.remove('shake');
    }, 1000);
    return;
  }

  const dateInputElement = document.querySelector('.js-due-date-input');
  const dueDate = dateInputElement.value;

  todoList.push({
    name,
    dueDate,
    createdAt: new Date().toISOString()
  });

  // Reset input fields
  inputElement.value = '';
  dateInputElement.value = '';
  
  // Focus on the input for the next entry
  inputElement.focus();
  
  saveTodos();
  renderTodoList();
  updateStats();
}

// Add shake animation class
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-5px); }
    40%, 80% { transform: translateX(5px); }
  }
  
  .shake {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }
`;
document.head.appendChild(style);