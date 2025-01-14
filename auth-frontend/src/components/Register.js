import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom"; // Import Link component

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      alert(response.data.message);
      window.location.href = '/login'; 
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "Something went wrong";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="col-md-6 shadow-lg p-5 rounded bg-white">
        <h2 className="text-center mb-4">Create an Account</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              id="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              id="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {isLoading ? (
            <div className="text-center">
              <div className="spinner-border" role="status"></div>
            </div>
          ) : (
            <button type="submit" className="btn btn-primary btn-block w-100">Register</button>
          )}
        </form>
        <div className="text-center mt-4">
          <p>Already have an account? <Link to="/Login" className="text-primary">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
