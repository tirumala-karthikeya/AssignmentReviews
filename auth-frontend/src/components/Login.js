import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending login data:', formData);
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { 
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          withCredentials: true 
        }
      );
  
      console.log('Login response:', response); 
  
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/profile");
      } else {
        setError("No token received");
      }
    } catch (error) {
      console.error("Error details:", error);
      setError(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="col-md-4 shadow-lg p-5 rounded bg-white">
        <h2 className="text-center mb-4">Login</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block w-100">Login</button>
        </form>
        <div className="text-center mt-4">
          <p>Don't have an account? <Link to="/Register" className="text-primary">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
