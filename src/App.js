import './App.css';
import * as ENV from "./environments.js"
import Parse from "parse";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Container } from "react-bootstrap";

// imports for components and services
import NavigationContainer from "./components/Navigation/NavigationContainer";
import DashboardContainer from "./components/Dashboard/DashboardContainer";
import WorkoutsContainer from "./components/Workouts/WorkoutsContainer";
import AddWorkoutContainer from "./components/AddWorkout/AddWorkoutContainer";
import AuthContainer from "./components/Auth/AuthContainer";
import authService from "./services/authService";
import workoutService from "./services/workoutService";
import AddSplitContainer from "./components/AddSplit/AddSplitContainer";

// Only do one parse initialization in the app.js
Parse.initialize(ENV.APPLICATION_ID, ENV.JAVASCRIPT_KEY);
Parse.serverURL = ENV.SERVER_URL;

function App() {
  // two use states: one for the user, one for their workouts
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);

  // get the current user. If they're a user, set them as user and load their workouts.
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser != null) {
      setUser(currentUser);
      loadUserWorkouts(currentUser.username);
    }
  }, []);

  // handler for loading user workouts and setting them as the workouts const.
  const loadUserWorkouts = async (username) => {
    // Load workouts from the JSON file into local storage
    await workoutService.loadWorkouts(username);
    const userWorkouts = workoutService.getWorkouts(username);
    setWorkouts(userWorkouts);
  };

  // handler for logging in that sets the user and loads the workouts for that user.
  const handleLogin = async (userData) => {
    try {
      console.log("App received login data:", userData);
      setUser(userData);
      await loadUserWorkouts(userData.username);
    } catch (error) {
      console.error("Error in handleLogin:", error);
      setUser(null); // Reset user state in case of error
    }
  };

  // handler for registration
  const handleRegister = async (userData) => {
    try {
      const newUser = await authService.register(
        userData.username,
        userData.password
      );
      setUser(newUser); 
      loadUserWorkouts(newUser.username);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // handler for logging out
  const handleLogout = () => {
    // need to remove because other user may login on same device
    authService.logout();
    setUser(null);
    setWorkouts([]);
  };

  // handler for adding a workout
  const handleAddWorkout = async (newWorkout) => {
    try {
      const updatedWorkout = await workoutService.addWorkout(
        user.username,
        newWorkout
      );
      setWorkouts(updatedWorkout);
    } catch (error) {
      console.error("Failed to add workout:", error);
    }
  };

  // Notes from the instructor: probably going to learn a better way to guard soon / this is a good way to do it for now
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavigationContainer user={user} onLogout={handleLogout} />
        <Container fluid className="flex-grow-1 mt-3">
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <DashboardContainer user={user} workouts={workouts} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/add-workout"
              element={
                user ? (
                  <AddWorkoutContainer
                    user={user}
                    onAddWorkout={handleAddWorkout}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/" replace />
                ) : (
                  <AuthContainer
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                  />
                )
              }
            />
            <Route
              path="/workouts"
              element={
                user ? (
                  <WorkoutsContainer user={user} workouts={workouts} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/add-split"
              element={
                user ? (
                  <AddSplitContainer user={user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}
export default App;
