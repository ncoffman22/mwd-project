import React from "react";
import AddWorkoutParent from "./AddWorkoutParent";

export default function AddWorkoutContainer ({ setWorkouts }) {
  //Wraps the workout component
  return (
    <div>
      <AddWorkoutParent setWorkouts={setWorkouts} />
    </div>
  );
}
