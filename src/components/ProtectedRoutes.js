// ProtectedRoutes.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoutes = ({ children }) => {
    // Check if the user is authenticated
    const isAuthenticated = authService.getCurrentUser();
    // If the user is not authenticated, redirect to the login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the children
    return children;
};

export default ProtectedRoutes;
