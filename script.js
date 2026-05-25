// 1. HTML elements ko pakadna
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const pendingList = document.getElementById('pendingList');
const completedList = document.getElementById('completedList');

// 2. Tumhare Python Backend (Kitchen) ka address
const API_URL = 'http://127.0.0.1:5000/tasks';

// 3. Database se saare tasks lekar aana aur screen par dikhana (GET)
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        
        // Screen clear karo taaki tasks double na dikhein
        pendingList.innerHTML = '';
        completedList.innerHTML = '';

        // Tasks ko loop karke sahi column mein bhejna
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            
            if (task.status === 'pending') {
                li.innerHTML = `
                    <span class="task-text">${task.task}</span>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="markDone(${task.id})" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #00bfff;" title="Mark Done">✔️</button>
                        <button onclick="deleteTask(${task.id})" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #ff4d4d;" title="Delete">❌</button>
                    </div>
                `;
                pendingList.appendChild(li);
            } else {
                li.innerHTML = `
                    <span class="task-text" style="text-decoration: line-through; opacity: 0.5;">${task.task}</span>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="deleteTask(${task.id})" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #ff4d4d;" title="Delete">❌</button>
                    </div>
                `;
                completedList.appendChild(li);
            }
        });
    } catch (error) {
        console.error("Backend se data lane mein error:", error);
    }
}

// 4. Naya Task Add karna (POST)
async function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return; // Agar box khali hai toh kuch mat karo

    const newTask = {
        task: taskText,
        status: 'pending'
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });

        if (response.ok) {
            taskInput.value = ''; // Input box khali karo
            fetchTasks();         // Updated list screen par dikhao
        }
    } catch (error) {
        console.error("Task add karne mein error:", error);
    }
}

// 5. Task ko Pending se 'Done' mein move karna (PUT)
window.markDone = async function(taskId) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT'
        });

        if (response.ok) {
            fetchTasks(); // UI ko refresh karo
        }
    } catch (error) {
        console.error("Task update karne mein error:", error);
    }
};

// 6. Task ko hamesha ke liye Delete karna (DELETE)
window.deleteTask = async function(taskId) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchTasks(); // UI ko refresh karo
        }
    } catch (error) {
        console.error("Task delete karne mein error:", error);
    }
};

// --- EVENTS ---

// Button par click karne se task add hoga
addTaskBtn.addEventListener('click', addTask);

// Keyboard par Enter dabane se bhi task add hoga
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// App khulte hi sabse pehle database se tasks load karo
fetchTasks();