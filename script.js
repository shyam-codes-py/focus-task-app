let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

function saveData() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderTasks();
}

// Countdown Logic
function getCountdownText(dateString) {
    if (!dateString) return '';
    const due = new Date(dateString);
    const now = new Date();
    const diff = due - now;
    
    if (diff < 0) return `<span class="countdown overdue">⚠️ Overdue!</span>`;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    
    if (days > 0) return `<span class="countdown">⏳ ${days}d ${hours}h left</span>`;
    return `<span class="countdown">⏳ ${hours}h left</span>`;
}

// Add Task (V3 Logic)
function addTask() {
    const input = document.getElementById('taskInput');
    const category = document.getElementById('taskCategory');
    const priority = document.getElementById('taskPriority');
    const dueDate = document.getElementById('taskDueDate');
    
    const text = input.value.trim();
    
    if (text !== "") {
        const newTask = {
            id: Date.now(),
            text: text,
            done: false,
            category: category.value,
            priority: priority.value,
            dueDate: dueDate.value
        };
        tasks.push(newTask);
        input.value = ""; 
        dueDate.value = ""; // Clear date
        saveData();
    }
}

function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, done: !task.done } : task);
    saveData();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveData();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newText = prompt("Edit your mission:", task.text);
    if (newText !== null && newText.trim() !== "") {
        tasks = tasks.map(t => t.id === id ? { ...t, text: newText.trim() } : t);
        saveData();
    }
}

function clearCompleted() {
    if (tasks.filter(t => t.done).length === 0) return;
    if (confirm("Clear all completed missions?")) {
        tasks = tasks.filter(t => t.done === false);
        saveData();
    }
}

// Render Logic with Sorting and Drag-and-Drop
function renderTasks() {
    const pendingList = document.getElementById('pendingList');
    const completedList = document.getElementById('completedList');
    
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    // Sorting Logic: High priority sabse upar
    const priorityWeights = { 'High': 3, 'Medium': 2, 'Low': 1 };
    const sortedTasks = [...tasks].sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);

    sortedTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.priority}`;
        li.draggable = true; // DRAG ENABLED! 🧲
        li.dataset.id = task.id; // ID save kar li drag ke liye

        // Drag Start Event
        li.addEventListener('dragstart', (e) => {
            li.classList.add('dragging');
            e.dataTransfer.setData('text/plain', task.id);
        });

        // Drag End Event
        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
        });

        li.innerHTML = `
            <div class="badge-container">
                <span class="badge badge-cat">${task.category}</span>
                <span class="badge badge-${task.priority}">${task.priority}</span>
            </div>
            
            <div class="task-top-row">
                <span class="task-text">${task.text}</span>
            </div>
            
            ${task.done ? '' : getCountdownText(task.dueDate)}
            
            <div class="task-actions">
                <button onclick="toggleTask(${task.id})">${task.done ? '↩️' : '✅'}</button>
                <button onclick="editTask(${task.id})">✏️</button>
                <button onclick="deleteTask(${task.id})">🗑️</button>
            </div>
        `;

        if (task.done) {
            completedList.appendChild(li);
        } else {
            pendingList.appendChild(li);
        }
    });
}

// --- DRAG AND DROP MAGIC (Board Listeners) ---
const boards = document.querySelectorAll('.board');
boards.forEach(board => {
    // Jab koi task board ke upar hover ho
    board.addEventListener('dragover', e => {
        e.preventDefault(); // Drop allow karne ke liye
        board.classList.add('drag-over'); // Glow on
    });

    // Jab task board ke bahar nikal jaye
    board.addEventListener('dragleave', () => {
        board.classList.remove('drag-over'); // Glow off
    });

    // Jab user task ko drop kare (chhod de)
    board.addEventListener('drop', e => {
        e.preventDefault();
        board.classList.remove('drag-over');
        
        const id = Number(e.dataTransfer.getData('text/plain'));
        const listId = board.querySelector('ul').id;
        
        // Agar "Completed" list mein drop kiya hai toh done = true kardo
        const isDone = (listId === 'completedList');
        
        tasks = tasks.map(t => t.id === id ? { ...t, done: isDone } : t);
        saveData(); // Refresh UI
    });
});

// Triggers
document.getElementById('taskInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTask();
});
document.getElementById('addTaskBtn').addEventListener('click', addTask);

// Install App Logic
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); deferredPrompt = e; installBtn.style.display = 'inline-block';
});
installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null; installBtn.style.display = 'none';
    }
});
window.addEventListener('appinstalled', () => { installBtn.style.display = 'none'; });

// Initial Render
renderTasks();

// Countdown live update hone ke liye har 1 minute baad refresh karo
setInterval(renderTasks, 60000);