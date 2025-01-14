import React, { useState } from "react";

const TaskItem = ({ task, deleteTask, updateTask, currentUserRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTaskName, setNewTaskName] = useState(task.name);
  const [newTaskDescription, setNewTaskDescription] = useState(task.description);

  const handleUpdate = () => {
    updateTask(task._id, {  // Changed from task.id to task._id
      name: newTaskName,
      description: newTaskDescription,
      completed: task.completed
    });
    setIsEditing(false);
  };

  return (
    <div className="list-group-item d-flex justify-content-between align-items-center p-4 mb-3 rounded shadow-sm bg-light">
      <div className="flex-grow-1">
        {isEditing ? (
          <div>
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="form-control mb-2"
              placeholder="Task Name"
            />
            <textarea
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="form-control mb-2"
              placeholder="Task Description"
            />
          </div>
        ) : (
          <div>
            <h5 className="text-primary mb-2">{task.name}</h5>
            <p className="mb-0">{task.description}</p>
          </div>
        )}
      </div>
      <div className="d-flex ms-3">
        {currentUserRole === "Admin" || currentUserRole === "User" ? (
          <>
            {isEditing ? (
              <button
                onClick={handleUpdate}
                className="btn btn-success btn-sm me-2 rounded-pill px-3 py-2"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-warning btn-sm me-2 rounded-pill px-3 py-2"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => deleteTask(task._id)}  // Changed from task.id to task._id
              className="btn btn-danger btn-sm rounded-pill px-3 py-2"
            >
              Delete
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default TaskItem;