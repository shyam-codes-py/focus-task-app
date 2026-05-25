from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('focus_tasks.db')
    conn.row_factory = sqlite3.Row
    return conn

with get_db_connection() as conn:
    conn.execute('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT NOT NULL, status TEXT NOT NULL)')
    conn.commit()

@app.route('/tasks', methods=['GET'])
def get_tasks():
    conn = get_db_connection()
    tasks = conn.execute('SELECT * FROM tasks').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in tasks])

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    conn = get_db_connection()
    conn.execute('INSERT INTO tasks (task, status) VALUES (?, ?)', (data['task'], data['status']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Task database mein save ho gaya!'}), 201

# ---- NAYA CODE: Task ko Done mark karne ke liye (PUT Request) ----
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def mark_done(task_id):
    conn = get_db_connection()
    # Database mein status ko 'done' set kar do jahan id match ho
    conn.execute('UPDATE tasks SET status = ? WHERE id = ?', ('done', task_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Task updated to done!'})

# ---- NAYA CODE: Task ko hamesha ke liye Delete karna (DELETE Request) ----
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    conn = get_db_connection()
    # Database se wo row uda do jahan id match kare
    conn.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Task database se ud gaya!'})
    
if __name__ == '__main__':
    print("🚀 Focus App Backend Starting...")
    app.run(debug=True, port=5000)