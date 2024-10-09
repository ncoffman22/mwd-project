import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import AuthChild from "./AuthChild";

export default function AuthParent({ onLogin, onRegister }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Handle changes to an individual's credentials
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Process a submission and either authenticate or register based on which page
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let user;
      if (isLogin) {
        // Call service to see if username and password are correct
        user = await authService.login(
          credentials.username,
          credentials.password
        );
        onLogin(user); // Pass the entire user object
      } else {
        // Register a new user if they do not currently exist
        user = await authService.register(
          credentials.username,
          credentials.password
        );
        onRegister(user); // Pass the entire user object
      }
      navigate("/");
    } catch (error) {
      console.log(isLogin ? "Login failed:" : "Registration failed:", error);
    }
  };

  return (
    <AuthChild
      credentials={credentials}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isLogin={isLogin}
      setIsLogin={setIsLogin}
    />
  );
}
