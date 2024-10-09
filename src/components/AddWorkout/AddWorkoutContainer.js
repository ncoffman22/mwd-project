import React from "react";
import AddWorkoutParent from "./AddWorkoutParent";

export default function ({ onAddWorkout }) {
  //Wraps the workout component
  return (
    <div>
      <AddWorkoutParent onAddWorkout={onAddWorkout} />
    </div>
  );
}
