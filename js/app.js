// DOM Elements
const addTaskBtn = document.getElementById('addTaskBtn');
const addTaskModal = document.getElementById('addTaskModal');
const addTaskForm = document.getElementById('addTaskForm');
const cancelBtn = document.getElementById('cancelBtn');
const tasksList = document.getElementById('tasksList');
const filterBtns = document.querySelectorAll('.filter-btn');

// State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Event Listeners
addTaskBtn.addEventListener('click', () => {
    addTaskModal.classList.add('active');
});

cancelBtn.addEventListener('click', () => {
    addTaskModal.classList.remove('active');
    addTaskForm.reset();
});

addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const date = document.getElementById('taskDate').value;
    const description = document.getElementById('taskDescription').value;
    
    const task = {
        id: Date.now(),
        title,
        date,
        description,
        completed: false
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    
    addTaskModal.classList.remove('active');
    addTaskForm.reset();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTasks(btn.dataset.filter);
    });
});

// Functions
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function renderTasks(filter = 'all') {
    let filteredTasks = [...tasks];
    
    if (filter === 'today') {
        const today = new Date().setHours(0, 0, 0, 0);
        filteredTasks = tasks.filter(task => {
            const taskDate = new Date(task.date).setHours(0, 0, 0, 0);
            return taskDate === today;
        });
    } else if (filter === 'week') {
        const today = new Date();
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        const weekEnd = new Date(today.setDate(today.getDate() + 6));
        
        filteredTasks = tasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate >= weekStart && taskDate <= weekEnd;
        });
    }
    
    tasksList.innerHTML = filteredTasks
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(task => `
            <div class="task-item" data-id="${task.id}">
                <h3>${task.title}</h3>
                <div class="task-date">${formatDate(task.date)}</div>
                <div class="task-description">${task.description}</div>
                <div class="task-actions">
                    <button onclick="toggleTask(${task.id})" class="toggle-btn">
                        ${task.completed ? '✓ Completed' : 'Mark Complete'}
                    </button>
                    <button onclick="deleteTask(${task.id})" class="delete-btn">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Initial render
renderTasks(); 