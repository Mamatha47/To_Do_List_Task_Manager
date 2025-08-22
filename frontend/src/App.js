import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingIndex, setEditingIndex] = useState(null);

  // Load from localStorage on page load
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "" || time.trim() === "") return;
    if (editingIndex !== null) {
      const updated = [...tasks];
      updated[editingIndex] = { ...updated[editingIndex], text: task, time };
      setTasks(updated);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, { text: task, time, completed: false }]);
    }
    setTask("");
    setTime("");
  };

  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const toggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const editTask = (index) => {
    setTask(tasks[index].text);
    setTime(tasks[index].time);
    setEditingIndex(index);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <div className="app-container">
      <h1 className="title">📝 Task Manager</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter time (e.g., 10:30 AM, 22 Aug)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button onClick={addTask}>{editingIndex !== null ? "Update" : "Add"}</button>
      </div>

      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((t, index) => (
            <tr key={index} className={t.completed ? "completed" : ""}>
              <td>{t.text}</td>
              <td>{t.time}</td>
              <td>{t.completed ? "✅ Completed" : "⏳ Pending"}</td>
              <td>
                <button onClick={() => toggleComplete(index)}>
                  {t.completed ? "Undo" : "Complete"}
                </button>
                <button onClick={() => editTask(index)}>Edit</button>
                <button onClick={() => deleteTask(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
