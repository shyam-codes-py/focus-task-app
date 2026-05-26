// 1. Data load karna (LocalStorage se)
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

// 2. Data save karne ka function
function saveData() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderTasks();
}

// 3. Task Add Logic
function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (text !== "") {
        const newTask = {
            id: Date.now(),
            text: text,
            done: false
        };
        tasks.push(newTask);
        input.value = ""; // Input saaf karo
        saveData();
    }
}

// 4. Toggle Logic (Done <-> Pending)
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, done: !task.done } : task
    );
    saveData();
}

// 5. Delete Logic
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveData();
}

// 6. Edit Logic (V2.0)
function editTask(id) {
    const taskToEdit = tasks.find(task => task.id === id);
    if (!taskToEdit) return;

    const newText = prompt("Edit your task:", taskToEdit.text);
    if (newText !== null && newText.trim() !== "") {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, text: newText.trim() } : task
        );
        saveData();
    }
}

// 7. Clear All Completed Tasks (V2.0)
function clearCompleted() {
    if (tasks.filter(task => task.done).length === 0) return; // Agar done me kuch na ho toh kuch mat karo

    const areYouSure = confirm("Kya tum sach mein saare 'Done' tasks delete karna chahte ho?");
    if (areYouSure) {
        tasks = tasks.filter(task => task.done === false);
        saveData();
    }
}

// 8. Render Logic (Screen par list dikhana)
function renderTasks() {
    const pendingList = document.getElementById('pendingList');
    const completedList = document.getElementById('completedList');
    
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div>
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

// 9. Input & Button Triggers
document.getElementById('taskInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTask();
});

document.getElementById('addTaskBtn').addEventListener('click', addTask);

// 10. --- CUSTOM INSTALL APP BUTTON LOGIC ---
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'inline-block'; // Button dikhao
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('App Installed Successfully!');
        }
        deferredPrompt = null;
        installBtn.style.display = 'none'; // Button chupa do
    }
});

window.addEventListener('appinstalled', () => {
    installBtn.style.display = 'none'; // Pehle se install hai toh button mat dikhao
});

// App khulte hi tasks render karo
renderTasks();