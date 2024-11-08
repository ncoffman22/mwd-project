import React from 'react';
import { Form, Button } from 'react-bootstrap';

export default function AddSplitChild( { split, availableWorkouts, onChange, onWorkoutsChange, onSubmit }) {
    const formatWorkoutOption = (workout) => {
        return `${workout.liftType} - ${workout.sets} x ${workout.reps}`;
    };

    return (
        <Form onSubmit={onSubmit}>
            <h2>Create New Split</h2>
            <Form.Group controlId="splitTitle">
                <Form.Label>Split Title</Form.Label>
                <Form.Control
                    type="text"
                    name="split_title"
                    value={split.split_title}
                    onChange={onChange}
                    required
                />
            </Form.Group>

            <Form.Group controlId="date">
                <Form.Label>Date</Form.Label>
                <Form.Control
                    type="date"
                    name="date"
                    value={split.date}
                    onChange={onChange}
                    required
                />
            </Form.Group>

            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <Form.Group key={num} controlId={`workout_${num}`}>
                    <Form.Label>Workout {num}</Form.Label>
                    <Form.Control
                        as="select"
                        value={split[`workout_${num}`] || ""}
                        onChange={(e) => onWorkoutsChange(`workout_${num}`, e.target.value)}
                        
                    >
                        <option value="">Select a Workout</option>
                        {availableWorkouts.map((workout) => (
                            <option key={workout.objectId} value={workout.objectId}>
                                {formatWorkoutOption(workout)}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>))}
            <Button type="submit">Submit</Button>
        </Form>
    )
}