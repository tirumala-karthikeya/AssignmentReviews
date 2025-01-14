import {React, useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";
import MainTask from "./components/Resources/MainTask";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
        />
        <Route path="/Resources" element={<MainTask/>}/>
      </Routes>
    </Router>
  );
};

export default App;
