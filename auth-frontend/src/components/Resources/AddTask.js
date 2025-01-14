import React, { useState } from "react";

const AddTask = ({ addTask }) => {
  const [task, setTask] = useState({ name: "", description: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.name.trim() && task.description.trim()) {
      addTask(task);
      setTask({ name: "", description: "" });
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Add a Task</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="taskName" className="form-label">Task Name</label>
            <input
              type="text"
              id="taskName"
              name="name"
              className="form-control"
              value={task.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="taskDescription" className="form-label">Description</label>
            <textarea
              id="taskDescription"
              name="description"
              className="form-control"
              value={task.description}
              onChange={handleChange}
              required
              rows="3"
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={!task.name.trim() || !task.description.trim()}
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;