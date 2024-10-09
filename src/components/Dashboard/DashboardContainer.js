import React from "react";
import DashboardParent from "./DashboardParent";

export default function DashboardContainer({ user, workouts }) {
  return <DashboardParent user={user} workouts={workouts} />;
}
