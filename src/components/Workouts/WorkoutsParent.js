import React from "react";
import WorkoutsChild from "./WorkoutsChild";
import { Card, ListGroup } from "react-bootstrap";

export default function WorkoutsParent({workouts}) {

  return (
    <Card>
      <Card.Header as="h2">Your Workouts</Card.Header>
      <ListGroup variant="flush">
        {workouts.map((workout) => (
          <ListGroup.Item key={workout.objectId}>
            <WorkoutsChild workout={workout} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}
