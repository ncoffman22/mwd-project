import React from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import ExerciseCard from './ExerciseCard';

const ExerciseList = ({ exercises, loading }) => {
    // If loading, display a spinner
    if (loading) {
        return (
            <div className="text-center py-4">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    // If no exercises are found, display a message
    if (exercises.length === 0) {
        return (
            <div className="text-center py-4">
                <p>No exercises found matching your criteria.</p>
            </div>
        );
    }
    // Display the list of exercise cards
    return (
        <Row xs={1} md={2} className="g-4">
            {exercises.map(exercise => (
                <Col key={exercise.id}>
                    <ExerciseCard exercise={exercise} />
                </Col>
            ))}
        </Row>
    );
};
export default ExerciseList;