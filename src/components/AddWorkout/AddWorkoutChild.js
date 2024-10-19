import React from "react";
import { Form, Button } from "react-bootstrap";

export default function AddWorkoutChild({ workout, onChange, onSubmit }) {
  // Per the workouts page, this will probably change to being more split/day focused, i.e.,
  // legs day, arms day, etc.
  return (
    <Form onSubmit={onSubmit}>
      <h2>Add New Workout</h2>
      <Form.Group controlId="name">
        <Form.Label>Exercise Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={workout.name}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Group controlId="sets">
        <Form.Label>Sets</Form.Label>
        <Form.Control
          type="number"
          name="sets"
          value={workout.sets}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Group controlId="reps">
        <Form.Label>Reps</Form.Label>
        <Form.Control
          type="number"
          name="reps"
          value={workout.reps}
          onChange={onChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="weight">
        <Form.Label>Weight</Form.Label>
        <Form.Control
          type="number"
          name="weight"
          value={workout.weight}
          onChange={onChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="date">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          name="reps"
          value={workout.datePerformed}
          onChange={onChange}
          required
        />
      </Form.Group>
      <hr />
      <Button variant="primary" type="submit">
        Add Workout
      </Button>
    </Form>
  );
}
