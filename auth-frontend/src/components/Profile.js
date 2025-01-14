import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const response = await axios.get(`http://localhost:5000/api/profile/${userId}`, {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (!userData) {
    return <div className="text-center my-5">No user data found</div>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div className="card shadow-lg rounded border-0">
        <div className="card-body p-5">
          <Link
            to="/Resources"
            className="btn btn-primary btn-lg text-white rounded-pill px-4 py-2 mb-4"
          >
            Resources
          </Link>

          <h2 className="card-title text-center mb-4">Your Profile</h2>
          <div className="mb-3">
            <p className="fw-bold">Username</p>
            <p className="text-muted">{userData.username}</p>
          </div>
          <div className="mb-3">
            <p className="fw-bold">Email</p>
            <p className="text-muted">{userData.email}</p>
          </div>
          <div className="mb-3">
            <p className="fw-bold">Role</p>
            <p className="text-muted">{userData.role}</p>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-danger w-100 py-2 mt-4"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
