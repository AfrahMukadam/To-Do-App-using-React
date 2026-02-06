const Task = require("../models/Task");

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = await Task.create({
      title,
      description,
      user: req.user, // from JWT middleware
    });

    res.status(201).json(task);
  } catch (error) {
  console.error("Task error:", error);
  res.status(500).json({ message: error.message });
}
};


// GET ALL TASKS FOR LOGGED-IN USER
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });
    res.json(tasks);
  } catch (error) {
  console.error("Task error:", error);
  res.status(500).json({ message: error.message });
}
};


// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
  console.error("Task error:", error);
  res.status(500).json({ message: error.message });
}
};


// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
  console.error("Task error:", error);
  res.status(500).json({ message: error.message });
}
};


module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
