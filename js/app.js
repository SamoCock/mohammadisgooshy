// DOM Elements
const tasksList = document.getElementById('tasksList');
const filterBtns = document.querySelectorAll('.filter-btn');

// Predefined tasks
const defaultTasks = [
    {
        id: 1,
        title: "Morning Walk with Luna 🐶",
        date: "2024-02-01T07:00",
        description: "Take Luna out for her morning walk",
        completed: false
    },
    {
        id: 2,
        title: "Morning Rest 😴",
        date: "2024-02-01T07:15",
        description: "Sleep time (until 10:00)",
        completed: false
    },
    {
        id: 3,
        title: "Luna's Walk 🐶",
        date: "2024-02-01T10:00",
        description: "Take Luna for her mid-morning walk",
        completed: false
    },
    {
        id: 4,
        title: "Morning Routine 🍞🪥",
        date: "2024-02-01T10:15",
        description: "Breakfast + Make food + Dishes + Brush teeth",
        completed: false
    },
    {
        id: 5,
        title: "Painting Session 🎨",
        date: "2024-02-01T11:15",
        description: "Focused painting time (with Luna's walk break at 13:00)",
        completed: false
    },
    {
        id: 6,
        title: "Quick Luna Break 🐶",
        date: "2024-02-01T13:00",
        description: "Quick break from painting to take Luna out",
        completed: false
    },
    {
        id: 7,
        title: "Afternoon Walk with Luna 🐶",
        date: "2024-02-01T15:00",
        description: "Take Luna for her afternoon walk",
        completed: false
    },
    {
        id: 8,
        title: "Free Time / More Painting 🎨🎮📖",
        date: "2024-02-01T15:15",
        description: "Flexible time for painting, gaming, or reading",
        completed: false
    },
    {
        id: 9,
        title: "Evening Walk with Luna 🐶",
        date: "2024-02-01T17:00",
        description: "Take Luna for her evening walk",
        completed: false
    },
    {
        id: 10,
        title: "Dinner Time 🍝🪥",
        date: "2024-02-01T18:00",
        description: "Dinner + Make food + Dishes + Brush teeth",
        completed: false
    },
    {
        id: 11,
        title: "Luna's Night Walk 🐶",
        date: "2024-02-01T19:00",
        description: "Take Luna for her post-dinner walk",
        completed: false
    },
    {
        id: 12,
        title: "Gym Time 🏋️",
        date: "2024-02-01T19:15",
        description: "Workout session at the gym",
        completed: false
    },
    {
        id: 13,
        title: "Evening Routine 🚿",
        date: "2024-02-01T21:15",
        description: "Shower + Wind down",
        completed: false
    },
    {
        id: 14,
        title: "Free Time 🎮👥📖",
        date: "2024-02-01T22:00",
        description: "Gaming, socializing, or reading",
        completed: false
    },
    {
        id: 15,
        title: "Last Walk with Luna 🐶",
        date: "2024-02-01T23:00",
        description: "Take Luna for her last walk of the day",
        completed: false
    },
    {
        id: 16,
        title: "Wind Down Time ✨",
        date: "2024-02-01T23:15",
        description: "Relax and prepare for sleep",
        completed: false
    },
    {
        id: 17,
        title: "Night Rest 😴",
        date: "2024-02-01T23:45",
        description: "Sleep time (until 07:00)",
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