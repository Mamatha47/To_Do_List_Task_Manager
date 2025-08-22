import React, { useState } from 'react';

const TaskList = ({ tasks, deleteTask, editTask, toggleComplete }) => {
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleEdit = (task) => {
    setEditId(task.id);
    setEditText(task.text);
  };

  const handleSave = (id) => {
    editTask(id, editText);
    setEditId(null);
    setEditText('');
  };

  return (
    <div className="task-table-container">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-task">No tasks found</td>
            </tr>
          ) : (
            tasks.map(task => (
              <tr key={task.id} className={task.completed ? 'completed-row' : ''}>
                <td>
                  {editId === task.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    task.text
                  )}
                </td>
                <td>
                  <span className={`status-badge ${task.completed ? 'completed' : 'pending'}`}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                </td>
                <td>{task.createdAt.toLocaleString()}</td>
                <td>
                  {editId === task.id ? (
                    <button className="btn save" onClick={() => handleSave(task.id)}>Save</button>
                  ) : (
                    <>
                      <button
                        className={`btn ${task.completed ? 'undo' : 'complete'}`}
                        onClick={() => toggleComplete(task.id)}
                      >
                        {task.completed ? 'Undo' : 'Complete'}
                      </button>
                      <button className="btn edit" onClick={() => handleEdit(task)}>Edit</button>
                      <button className="btn delete" onClick={() => deleteTask(task.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
