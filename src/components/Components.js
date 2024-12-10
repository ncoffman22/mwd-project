import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardContainer from './Dashboard/DashboardContainer';
import AddWorkoutContainer from './AddWorkout/AddWorkoutContainer';
import AuthContainer from './Auth/AuthContainer';
import AddSplitContainer from './AddSplit/AddSplitContainer';
import WorkoutDetailComponent from './WorkoutDetail/WorkoutDetailComponent';
import ProtectedRoutes from './ProtectedRoutes';
import authService from '../services/authService';
import CalendarContainer from './Calendar/CalendarContainer';
import WikiContainer from './Wiki/WikiContainer';
import AccountContainer from './Account/AccountContainer'
const Components = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoutes>
                        <DashboardContainer />
                    </ProtectedRoutes>
                }
            />
            <Route
                path="/add-workout"
                element={
                    <ProtectedRoutes>
                        <AddWorkoutContainer />
                    </ProtectedRoutes>
                }
            />
            <Route
                path="/login"
                element={
                    authService.getCurrentUser() ? (
                        <Navigate to="/" replace />
                    ) : (
                        <AuthContainer />
                    )
                }
            />
            <Route
                path="/calendar"
                element={
                    <ProtectedRoutes>
                        <CalendarContainer/>
                    </ProtectedRoutes>
                }
            />
            <Route
                path="/workout/:workoutId"    
                element={
                    <ProtectedRoutes>
                        <WorkoutDetailComponent />
                    </ProtectedRoutes>
                }
            />
            <Route
                path="/splits"
                element={
                    <ProtectedRoutes>
                        <AddSplitContainer />
                    </ProtectedRoutes>
                }
            />
            <Route
                path="*"
                element={
                    <ProtectedRoutes>
                        <DashboardContainer />
                    </ProtectedRoutes>
                }
            />
            <Route 
                path="/wiki" 
                element={
                    <ProtectedRoutes>
                        <WikiContainer />
                    </ProtectedRoutes>
                }
            />
            <Route 
                path="/account" 
                element={
                    <ProtectedRoutes>
                        <AccountContainer />
                    </ProtectedRoutes>
                }
            />
        </Routes>
    );
};

export default Components;