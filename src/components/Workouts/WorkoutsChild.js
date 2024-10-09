import React from "react";
import { Card } from "react-bootstrap";

export default function WorkoutsChild({ workout }) {
  // create a separate card for each Workout
  // this is  going to shift to being day/split based at some point
  return (
    <Card>
      <Card.Body>
        <Card.Title>{workout.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Date: {workout.date}
        </Card.Subtitle>
        <Card.Text>
          <strong>Sets:</strong> {workout.sets}
          <br />
          <strong>Reps:</strong> {workout.reps}
          <br />
          <strong>Weight:</strong> {workout.weight} lbs
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
