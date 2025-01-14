const Task = require("../models/taskModel");

// Create a new task
const createTask = async (req, res) => {
  try {
    console.log('Received data:', req.body);
    
    // Validate required fields
    if (!req.body.name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!req.body.description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const task = new Task({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status || 'pending',
      completed: req.body.completed || false
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Task creation error:', error);
    res.status(400).json({ 
      message: "Failed to create task", 
      error: error.message 
    });
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch tasks", error: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: "Failed to update task", error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete task", error: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
};