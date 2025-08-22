import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

/**
 * GET /api/tasks
 * (optional) ?status=Pending|Completed
 */
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && ["Pending", "Completed"].includes(status)) query.status = status;
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Server error while fetching tasks" });
  }
});

/**
 * POST /api/tasks
 */
router.post("/", async (req, res) => {
  try {
    const { title, description, dueDate, priority, category, status } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: "Title is required" });

    const newTask = new Task({
      title: title.trim(),
      description: (description || "").trim(),
      dueDate: dueDate || null,
      priority: priority || "Medium",
      category: (category || "").trim(),
      status: status || "Pending",
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error saving task:", err);
    res.status(500).json({ error: "Server error while saving task" });
  }
});

/**
 * PUT /api/tasks/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Server error while updating task" });
  }
});

/**
 * PATCH /api/tasks/:id/toggle
 * Toggle status between Pending <-> Completed
 */
router.patch("/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    task.status = task.status === "Completed" ? "Pending" : "Completed";
    await task.save();
    res.json(task);
  } catch (err) {
    console.error("Error toggling task:", err);
    res.status(500).json({ error: "Server error while toggling task" });
  }
});

/**
 * DELETE /api/tasks/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Server error while deleting task" });
  }
});

export default router;
