import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import "./TaskPage.css";

const formatDateInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);

  // add/edit form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    category: "",
    status: "Pending",
  });
  const [editingId, setEditingId] = useState(null);

  // filter state
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchTasks = async () => {
    const params = {};
    if (statusFilter !== "All") params.status = statusFilter;
    const { data } = await api.get("/tasks", { params });
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === "Pending").length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    return { total, pending, completed };
  }, [tasks]);

  const clearForm = () => {
    setForm({ title: "", description: "", dueDate: "", priority: "Medium", category: "", status: "Pending" });
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
    };

    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, payload);
      } else {
        await api.post("/tasks", payload);
      }
      await fetchTasks();
      clearForm();
    } catch (err) {
      console.error("Save error:", err?.response?.data || err.message);
      alert(err?.response?.data?.error || "Failed to save task");
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setForm({
      title: task.title || "",
      description: task.description || "",
      dueDate: formatDateInput(task.dueDate),
      priority: task.priority || "Medium",
      category: task.category || "",
      status: task.status || "Pending",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      console.error("Delete error:", err?.response?.data || err.message);
      alert(err?.response?.data?.error || "Failed to delete task");
    }
  };

  const toggle = async (task) => {
    try {
      await api.patch(`/tasks/${task._id}/toggle`);
      await fetchTasks();
    } catch (err) {
      console.error("Toggle error:", err?.response?.data || err.message);
      alert(err?.response?.data?.error || "Failed to toggle status");
    }
  };

  return (
    <div className="task-container">
      {/* Stats */}
      <div className="stats">
        <div className="stat stat-all">All: {stats.total}</div>
        <div className="stat stat-pending">Pending: {stats.pending}</div>
        <div className="stat stat-completed">Completed: {stats.completed}</div>
      </div>

      {/* Add / Edit Form */}
      <form className="task-form" onSubmit={submit}>
        <div className="form-header">
          <h2>{editingId ? "Edit Task" : "Add Task"}</h2>
          {editingId && (
            <button type="button" className="btn btn-ghost" onClick={clearForm}>
              Cancel Edit
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Title *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="row-3">
          <div>
            <label>Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>

          <div>
            <label>Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <input
          type="text"
          placeholder="Category (e.g., Work, Personal)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <button type="submit" className="btn btn-primary">
          {editingId ? "Update Task" : "Add Task"}
        </button>
      </form>

      {/* Filters */}
      <div className="filters">
        <span>Filter by status:</span>
        <div className="chip-group">
          <button className={`chip ${statusFilter === "All" ? "active" : ""}`} onClick={() => setStatusFilter("All")}>All</button>
          <button className={`chip ${statusFilter === "Pending" ? "active" : ""}`} onClick={() => setStatusFilter("Pending")}>Pending</button>
          <button className={`chip ${statusFilter === "Completed" ? "active" : ""}`} onClick={() => setStatusFilter("Completed")}>Completed</button>
        </div>
      </div>

      {/* Task List */}
      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty">No tasks. Add one above!</div>
        ) : (
          tasks.map((t) => (
            <div className={`task-card ${t.status === "Completed" ? "completed" : "pending"}`} key={t._id}>
              <div className="task-card-header">
                <h3>{t.title}</h3>
                <span className={`badge ${t.status === "Completed" ? "badge-completed" : "badge-pending"}`}>
                  {t.status}
                </span>
              </div>

              {t.description && <p className="desc">{t.description}</p>}

              <div className="meta">
                <span><b>Priority:</b> {t.priority}</span>
                <span><b>Category:</b> {t.category || "—"}</span>
                <span><b>Due:</b> {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No date"}</span>
              </div>

              <div className="actions">
                <button className="btn btn-success" onClick={() => toggle(t)}>
                  {t.status === "Completed" ? "Mark Pending" : "Mark Completed"}
                </button>
                <button className="btn btn-ghost" onClick={() => startEdit(t)}>Edit</button>
                <button className="btn btn-danger" onClick={() => remove(t._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
