import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const MainTask = () => {
  const [tasks, setTasks] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    status: "pending",
    completed: false
  });
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const userResponse = await axios.get("http://localhost:5000/api/auth/current-user");
        setCurrentUserRole(userResponse.data.role);
        
        const tasksResponse = await axios.get("http://localhost:5000/api/tasks");
        setTasks(tasksResponse.data);
        setError(null);
      } catch (error) {
        console.error("Error initializing app:", error);
        setError("Failed to load tasks. Please try again later.");
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [navigate]);

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/tasks", newTask);
      setTasks([...tasks, response.data]);
      setNewTask({
        name: "",
        description: "",
        status: "Good",
        completed: false
      });
      setError(null);
    } catch (error) {
      console.error("Error adding task:", error.response?.data || error);
      setError(error.response?.data?.message || "Failed to add task. Please try again.");
    }
  };

  const deleteTask = async (taskId) => {
    if (currentUserRole !== "Admin") {
      setError("You don't have permission to delete tasks");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      setError(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    }
  };

  const updateTask = async (taskId, updatedTask) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedTask);
      // Update the task in the state without reloading the page
      setTasks(tasks.map((task) => (task._id === taskId ? response.data : task)));
      setEditingTask(null);  // Close the edit form after successful update
      setError(null);  // Clear any previous errors
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col d-flex justify-content-between align-items-center">
          <h1 className="mb-0">Product Reviews</h1>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted">Role: {currentUserRole}</span>
            <button
              onClick={handleLogout}
              className="btn btn-danger"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row mb-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Add Product Review</h5>
              <form onSubmit={addTask}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Product Name"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Product Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <select
                    className="form-select"
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Worst">Worst</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Add Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h2 className="mb-4">Reviews</h2>
          {tasks.length === 0 ? (
            <div className="alert alert-info">No Reviews available</div>
          ) : (
            <div className="list-group">
              {tasks.map((task) => (
                <div key={task._id} className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1">{task.name}</h5>
                      <p className="mb-1">{task.description}</p>
                      <small className="text-muted">
                        Status: {task.status}
                      </small>
                    </div>
                    <div className="btn-group">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="btn btn-info ms-2"
                      >
                        Update
                      </button>
                      {currentUserRole === "Admin" && (
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="btn btn-danger ms-2"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editingTask && (
        <div className="row mt-4">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Update Review</h5>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateTask(editingTask._id, editingTask); // Call updateTask on form submit
                  }}
                >
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      value={editingTask.name}
                      onChange={(e) =>
                        setEditingTask({ ...editingTask, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      value={editingTask.description}
                      onChange={(e) =>
                        setEditingTask({ ...editingTask, description: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <select
                      className="form-select"
                      value={editingTask.status}
                      onChange={(e) =>
                        setEditingTask({ ...editingTask, status: e.target.value })
                      }
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Worst">Worst</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-success">
                    Update Review
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => setEditingTask(null)} // Cancel edit on clicking cancel
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainTask;
