import React from "react";
import DashboardChild from "./DashboardChild";
import { Card } from "react-bootstrap";

export default function DashboardParent({ user, workouts }) {
  // if there is no user just return a loading screen for now. Probably will change this a login link at
  // some point.
  if (!user) {
    return (
      <Card>
        <Card.Header as="h1">Weightlifting Tracker Dashboard</Card.Header>
        <Card.Body>
          <p>Loading ...</p>
        </Card.Body>
      </Card>
    );
  }
  
  return (
    <Card>
      <Card.Header as="h1">Weightlifting Tracker Dashboard</Card.Header>
      <Card.Body>
        <DashboardChild username={user} workouts={workouts || []} />
      </Card.Body>
    </Card>
  );
}
