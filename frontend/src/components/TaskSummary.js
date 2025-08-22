import React from "react";
import "./TaskSummary.css";

const TaskSummary = ({ tasks, onEdit, onDelete, onToggle, filter, setFilter }) => {
  // ✅ Filter tasks based on selection
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true; // all
  });

  return (
    <div className="container">
      <h1>My To-Do List</h1>

      <div className="filter-buttons">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length === 0 ? (
            <tr>
              <td colSpan="4">No tasks available</td>
            </tr>
          ) : (
            filteredTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.text}</td>
                <td>{task.completed ? "Completed" : "Pending"}</td>
                <td>{new Date(task.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="action-btn complete-btn"
                    onClick={() => onToggle(task.id)}
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => onEdit(task.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => onDelete(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskSummary;
