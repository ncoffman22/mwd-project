import React from "react";
import DashboardParent from "./DashboardParent";

export default function DashboardContainer({ workouts }) {
  return <DashboardParent  workouts={workouts} />;
}
