const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.post("/", createTask);

router.get("/", getAllTasks);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

module.exports = router;
