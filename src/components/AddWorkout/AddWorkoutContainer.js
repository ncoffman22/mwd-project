import React from "react";
import AddWorkoutParent from "./AddWorkoutParent";

export default function ({ user, onAddWorkout }) {
  //Wraps the workout component
  return (
    <div>
      <AddWorkoutParent onAddWorkout={onAddWorkout} user={user} />
    </div>
  );
}
