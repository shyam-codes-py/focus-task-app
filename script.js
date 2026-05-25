// 1. Data load karna (Agar storage mein kuch ho, nahi toh empty list)
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

// 2. LocalStorage mein save karne ka function
function saveData() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderTasks();
}

// 3. Task Add karne ka logic
function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (text !== "") {
        const newTask = {
            id: Date.now(), // Unique ID time ke hisab se
            text: text,
            done: false
        };
        tasks.push(newTask);
        input.value = ""; // Input saaf karo
        saveData();
    }
}

// 4. Task Toggle (Pending <-> Done)
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, done: !task.done } : task
    );
    saveData();
}

// 5. Task Delete
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveData();
}

// 6. UI Render karne ka logic (HTML banakar board mein dalna)
function renderTasks() {
    const pendingList = document.getElementById('pendingList');
    const completedList = document.getElementById('completedList');
    
    // List saaf karo pehle
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div>
                <button onclick="toggleTask(${task.id})">${task.done ? '↩️' : '✅'}</button>
                <button onclick="deleteTask(${task.id})" style="color: #ff4d4d;">🗑️</button>
            </div>
        `;

        if (task.done) {
            completedList.appendChild(li);
        } else {
            pendingList.appendChild(li);
        }
    });
}

// 7. Event Listener: Enter dabane par task add ho jaye
document.getElementById('taskInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTask();
});

// Initial load
renderTasks();