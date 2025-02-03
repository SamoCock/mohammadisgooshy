// DOM Elements
const tasksList = document.getElementById('tasksList');

// Current date state
let currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

// Function to format date for display
function formatDisplayDate(date) {
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Function to format time
function formatDate(dateString) {
    const options = { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    return new Date(dateString).toLocaleTimeString('en-US', options);
}

// Function to create tasks for a specific date
function createTasksForDate(date) {
    const dateString = date.toISOString().split('T')[0];
    return [
        {
            id: 1,
            title: "Morning Walk with Luna 🐶",
            date: `${dateString}T07:00`,
            completed: false
        },
        {
            id: 2,
            title: "Morning Rest 😴",
            date: `${dateString}T07:15`,
            completed: false
        },
        {
            id: 3,
            title: "Luna's Walk 🐶",
            date: `${dateString}T10:00`,
            completed: false
        },
        {
            id: 4,
            title: "Morning Routine 🍞🪥",
            date: `${dateString}T10:15`,
            completed: false
        },
        {
            id: 5,
            title: "Painting Session 🎨",
            date: `${dateString}T11:15`,
            completed: false
        },
        {
            id: 6,
            title: "Quick Luna Break 🐶",
            date: `${dateString}T13:00`,
            completed: false
        },
        {
            id: 7,
            title: "Afternoon Walk with Luna 🐶",
            date: `${dateString}T15:00`,
            completed: false
        },
        {
            id: 8,
            title: "Free Time / More Painting 🎨🎮📖",
            date: `${dateString}T15:15`,
            completed: false
        },
        {
            id: 9,
            title: "Evening Walk with Luna 🐶",
            date: `${dateString}T17:00`,
            completed: false
        },
        {
            id: 10,
            title: "Dinner Time 🍝🪥",
            date: `${dateString}T18:00`,
            completed: false
        },
        {
            id: 11,
            title: "Luna's Night Walk 🐶",
            date: `${dateString}T19:00`,
            completed: false
        },
        {
            id: 12,
            title: "Gym Time 🏋️",
            date: `${dateString}T19:15`,
            completed: false
        },
        {
            id: 13,
            title: "Evening Routine 🚿",
            date: `${dateString}T21:15`,
            completed: false
        },
        {
            id: 14,
            title: "Free Time 🎮👥📖",
            date: `${dateString}T22:00`,
            completed: false
        },
        {
            id: 15,
            title: "Last Walk with Luna 🐶",
            date: `${dateString}T23:00`,
            completed: false
        },
        {
            id: 16,
            title: "Wind Down Time ✨",
            date: `${dateString}T23:15`,
            completed: false
        },
        {
            id: 17,
            title: "Night Rest 😴",
            date: `${dateString}T23:45`,
            completed: false
        }
    ];
}

// State
let tasks = {};

// Load tasks for current date
function loadTasksForDate(date) {
    const dateKey = date.toISOString().split('T')[0];
    if (!tasks[dateKey]) {
        const savedTasks = localStorage.getItem(`tasks_${dateKey}`);
        tasks[dateKey] = savedTasks ? JSON.parse(savedTasks) : createTasksForDate(date);
    }
    return tasks[dateKey];
}

// Save tasks for specific date
function saveTasks(date) {
    const dateKey = date.toISOString().split('T')[0];
    localStorage.setItem(`tasks_${dateKey}`, JSON.stringify(tasks[dateKey]));
}

// Navigation functions
function goToNextDay() {
    currentDate.setDate(currentDate.getDate() + 1);
    renderAll();
}

function goToPreviousDay() {
    currentDate.setDate(currentDate.getDate() - 1);
    renderAll();
}

// Stats calculation
function calculateStats(tasksList) {
    const total = tasksList.length;
    const completed = tasksList.filter(task => task.completed).length;
    const remaining = total - completed;
    const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, remaining, percentComplete };
}

// Render functions
function renderDateNavigation() {
    const dateNav = document.createElement('div');
    dateNav.className = 'date-navigation';
    dateNav.innerHTML = `
        <button class="date-nav-btn" onclick="goToPreviousDay()">←</button>
        <div class="current-date">${formatDisplayDate(currentDate)}</div>
        <button class="date-nav-btn" onclick="goToNextDay()">→</button>
    `;
    
    const container = document.querySelector('.app-container');
    const existingNav = document.querySelector('.date-navigation');
    if (existingNav) {
        container.replaceChild(dateNav, existingNav);
    } else {
        container.insertBefore(dateNav, tasksList);
    }
}

function renderStats(currentTasks) {
    const stats = calculateStats(currentTasks);
    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats-container';
    statsContainer.innerHTML = `
        <h3>Daily Progress</h3>
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-number">${stats.completed}</div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${stats.remaining}</div>
                <div class="stat-label">Remaining</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${stats.percentComplete}%</div>
                <div class="stat-label">Complete</div>
            </div>
        </div>
    `;
    
    const container = document.querySelector('.app-container');
    const existingStats = document.querySelector('.stats-container');
    if (existingStats) {
        container.replaceChild(statsContainer, existingStats);
    } else {
        container.insertBefore(statsContainer, tasksList);
    }
}

function renderTasks() {
    const currentTasks = loadTasksForDate(currentDate);
    
    tasksList.innerHTML = currentTasks
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" 
                       class="task-checkbox" 
                       ${task.completed ? 'checked' : ''} 
                       onchange="toggleTask(${task.id})"
                       aria-label="Mark task as complete">
                <div class="task-content">
                    <h3>${task.title}</h3>
                    <div class="task-date">${formatDate(task.date)}</div>
                </div>
            </div>
        `).join('');
}

function renderAll() {
    renderDateNavigation();
    renderStats(loadTasksForDate(currentDate));
    renderTasks();
}

function showLoveMessage() {
    const existingMessage = document.querySelector('.love-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const message = document.createElement('div');
    message.className = 'love-message';
    message.innerHTML = `
        <h2>I LOVE YOU</h2>
        <p>✨💖✨</p>
    `;
    document.body.appendChild(message);

    // Remove the message after animation completes
    setTimeout(() => {
        message.remove();
    }, 3000);
}

function toggleTask(id) {
    const currentTasks = loadTasksForDate(currentDate);
    const task = currentTasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks(currentDate);
        renderAll();

        // Check if all tasks are completed
        const allCompleted = currentTasks.every(t => t.completed);
        if (allCompleted) {
            showLoveMessage();
        }
    }
}

// Make sure DOM is loaded before rendering
document.addEventListener('DOMContentLoaded', () => {
    renderAll();
}); 