// Components.js
import React, {useState} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardContainer from './Dashboard/DashboardContainer';
import AddWorkoutContainer from './AddWorkout/AddWorkoutContainer';
import AuthContainer from './Auth/AuthContainer';
import WorkoutsContainer from './Workouts/WorkoutsContainer';
import AddSplitContainer from './AddSplit/AddSplitContainer';
import ProtectedRoutes from './ProtectedRoutes';
import authService from '../services/authService';

// Here are the different routes for the application
// Send each component to the protected routes to make sure the user is authenticated to be there
const Components = () => {
  const [workouts, setWorkouts] = useState([]);
  return (
  <Routes>
    <Route
      path="/"
      element={
        <ProtectedRoutes>
          <DashboardContainer workouts={workouts} />
        </ProtectedRoutes>
      }
    />
    <Route
      path="/add-workout"
      element={
        <ProtectedRoutes>
          <AddWorkoutContainer  setWorkouts={setWorkouts} />
        </ProtectedRoutes>
      }
    />
    <Route
      path="/login"
      element={
        authService.getCurrentUser() ? (
          <Navigate to="/" replace />
        ) : (
          <AuthContainer setWorkouts={setWorkouts} />
        )
      }
    />
    <Route
      path="/workouts"
      element={
        <ProtectedRoutes>
          <WorkoutsContainer workouts={workouts} />
        </ProtectedRoutes>
      }
    />
    <Route
      path="/splits"
      element={
        <ProtectedRoutes>
          <AddSplitContainer  />
        </ProtectedRoutes>
      }
    />
    <Route // Ensures that any other path is either sent to dashbaord if authenticated or to login if not
      path="*"
      element={
        <ProtectedRoutes>
          <DashboardContainer workouts={workouts}  />
        </ProtectedRoutes>
      }
    />
  </Routes>
)};

export default Components;
