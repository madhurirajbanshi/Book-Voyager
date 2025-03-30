import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../components/Profile/Sidebar";
import axios from "axios";
import { Outlet } from "react-router-dom"; 

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Using token:", token);

        if (!token) {
          throw new Error("No token found in localStorage");
        }

        console.log("Fetching user data...");
        const response = await axios.get(
          "http://localhost:5000/auth/userinformation",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response.data);

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user information:", error);
        setError(error.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    console.log("isLoggedIn state:", isLoggedIn);

    const token = localStorage.getItem("token");
    if (token) {
      fetchUserInfo();
    } else {
      setLoading(false);
      setError("Not logged in (no token found)");
    }
  }, []);

  return (
    <div className="bg-white px-2 md:px-12 flex flex-col ml-10 md:flex-row h-screen py-8 gap-4 text-black">
      <div className="w-1/6">
        <Sidebar user={user} loading={loading} />
      </div>
      <div className="flex-1">
        <Outlet /> 
      </div>
    </div>
  );
};

export default Profile;
