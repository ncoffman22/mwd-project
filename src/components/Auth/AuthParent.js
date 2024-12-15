// AuthParent.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import AuthChild from "./AuthChild";

export default function AuthParent() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear any previous errors
        
        try {
            if (!credentials.username || !credentials.password) {
                throw new Error("Username and password are required");
            }

            if (isLogin) {
                await authService.login(
                    credentials.username,
                    credentials.password
                );
            } else {
                await authService.register(
                    credentials.username,
                    credentials.password
                ); // For register, this will occur
            }
            navigate("/");
        } catch (error) {
            setError(error.message);
            console.error(isLogin ? "Login failed:" : "Registration failed:", error);
        }
    };

    return (
        <AuthChild
            credentials={credentials}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            error={error}
        />
    );
}