import React from "react";
import { Card, ListGroup } from "react-bootstrap";

export default function DashboardChild({ workouts = [] }) {
  // The only complicated thing in this is the mapping function that takes each workout name and
  // show the date.

  // Eventually, this is going to include something like goal achievement with graphs and percentages
  // regarding how close someone is to completing there goals (getting 225 on bench for example)

  // We'll also probably create a couple other children cards in order to achieve the modularity we're
  // looking for and to display all the types of information we want to display.
  return (
    <div>
      <h2>Welcome!</h2>
      <Card>
        <Card.Header>Recent Workouts</Card.Header>
        <ListGroup variant="flush">
          {workouts.length > 0 ? (
            workouts.map((workout, index) => (
              <ListGroup.Item key={index}>
                {workout.name || "Unnamed Workout}"} -{" "}
                {workout.date || "No Date"}
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>No Workouts Found</ListGroup.Item>
          )}
        </ListGroup>
      </Card>
    </div>
  );
}
