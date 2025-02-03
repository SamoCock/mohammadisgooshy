// DOM Elements
const tasksList = document.getElementById('tasksList');
const filterBtns = document.querySelectorAll('.filter-btn');

// Predefined tasks
const defaultTasks = [
    {
        id: 1,
        title: "Morning Skincare Routine ✨",
        date: "2024-02-01T08:00",
        description: "Cleanse, tone, moisturize, and sunscreen",
        completed: false
    },
    {
        id: 2,
        title: "Study Session 📚",
        date: "2024-02-01T10:00",
        description: "Review notes and complete assignments",
        completed: false
    },
    {
        id: 3,
        title: "Afternoon Tea Break 🫖",
        date: "2024-02-01T15:00",
        description: "Take a relaxing break with tea and snacks",
        completed: false
    },
    {
        id: 4,
        title: "Evening Walk 🌸",
        date: "2024-02-01T18:00",
        description: "30-minute walk in the park",
        completed: false
    }
];

// State
let tasks = JSON.parse(localStorage.getItem('tasks')) || defaultTasks;

// Event Listeners
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
    }
    
    tasksList.innerHTML = filteredTasks
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <h3>${task.title}</h3>
                <div class="task-date">${formatDate(task.date)}</div>
                <div class="task-description">${task.description}</div>
                <div class="task-actions">
                    <button onclick="toggleTask(${task.id})" class="toggle-btn ${task.completed ? 'completed' : ''}">
                        ${task.completed ? '✓ Done' : 'Mark Done'}
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