import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authActions } from "../Store/auth";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!values.username) newErrors.username = "Username is required.";
    if (!values.password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/auth/sign-in", {
        username: values.username,
        password: values.password,
      });

      const { token, id, role } = response.data;

      console.log("==== Login Successful ====");
      console.log("User ID:", id);
      console.log("Role:", role);
      console.log("Token:", token);

      dispatch(authActions.login());
      dispatch(authActions.changeRole(role));

      if (rememberMe) {
        // Store data persistently
        localStorage.setItem("token", token);
        localStorage.setItem("userId", id);
        localStorage.setItem("role", role);
      } else {
        // Store data only for the session
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userId", id);
        sessionStorage.setItem("role", role);
      }

      navigate("/");
    } catch (error) {
      setLoading(false);
      setErrors({
        general:
          error.response?.data?.message || "Login failed. Please try again.",
      });
      console.error("Login Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-16 mt-10 py-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Login
        </h2>
        {errors.general && (
          <p className="text-red-500 text-center mb-4">{errors.general}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-lg font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={values.username}
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 text-gray-700 text-lg font-medium"
            >
              Remember Me
            </label>
          </div>

          <div className="mb-6">
            <button
              type="submit"
              className="w-full bg-pink-600 text-white text-lg py-2 rounded-md hover:bg-pink-700 transition duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <a href="/signup" className="text-pink-600 hover:underline">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
