import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  category: { type: String },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
