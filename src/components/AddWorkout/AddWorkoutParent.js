import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddWorkoutChild from "./AddWorkoutChild";
import SplitSelectorChild from "./SplitSelectorChild";
import splitService from "../../services/splitService";
import { useEffect } from "react";
import authService from "../../services/authService";
import workoutService from "../../services/workoutService";

export default function AddWorkoutParent({ setWorkouts}) {
  const [workout, setWorkout] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    date: new Date().toISOString().split("T")[0], 
  });
  const user = authService.getCurrentUser().get("username") // Get the current user
  const [split, setSplit] = useState([]);
  const [selectedSplit, setSelectedSplit] = useState("");
// Load all of that user's splits
  useEffect(() => {
    const loadSplits = async () => {
      const fetchedSplits = await splitService.loadSplits(user);
      setSplit(fetchedSplits);
    };
    loadSplits();
  }, [user]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    // update a workout with new changes
    const { name, value } = e.target;
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
    // Add new workout and call function to save
    e.preventDefault();
    const newWorkout = {
      ...workout,
      sets: parseInt(workout.sets),
      reps: parseInt(workout.reps),
      weight: parseFloat(workout.weight),
      splitID: selectedSplit,
      liftType: workout.name,
      datePerformed: new Date(workout.date),  // Correcting this line to create a Date object
    };
    // Add the workout
    const updatedWorkout = await workoutService.addWorkout(user, newWorkout);
    setWorkouts(updatedWorkout);
    // Reset the form
    setWorkout({
      name: "",
      sets: "",
      reps: "",
      weight: "",
      date: new Date().toISOString().split("T")[0],  // Default to today
    });
    navigate("/workouts"); // Send to workout page
};

  /// Allow the user to add a new workout associated with a split of their choosing
  return (
    <>
        <SplitSelectorChild
          split={split}
          selectedSplit={selectedSplit}
          onSelectSplit={setSelectedSplit}
        />
        <hr />
        <AddWorkoutChild
          workout={workout}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
    </>
  );
}
