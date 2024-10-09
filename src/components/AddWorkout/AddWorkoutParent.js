import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddWorkoutChild from "./AddWorkoutChild";

export default function AddWorkoutParent({ onAddWorkout }) {
  const [workout, setWorkout] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    date: new Date().toISOString().split("T")[0], // Default to today
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    // update a workout with new changes
    const { name, value } = e.target;
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    // Add new workout and call function to save
    e.preventDefault();
    const newWorkout = {
      ...workout,
      id: Date.now(),
      sets: parseInt(workout.sets),
      reps: parseInt(workout.reps),
      weight: parseFloat(workout.weight),
    };
    // Add the workout
    onAddWorkout(newWorkout);

    // Reset the form
    setWorkout({
      name: "",
      sets: "",
      reps: "",
      weight: "",
      date: new Date().toISOString().split("T")[0],
    });
    navigate("/workouts"); // Send to workout page
  };

  return (
    <AddWorkoutChild
      workout={workout}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
