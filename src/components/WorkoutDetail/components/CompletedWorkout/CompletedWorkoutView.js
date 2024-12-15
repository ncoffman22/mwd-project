import React from 'react';
import { Button } from 'react-bootstrap';
import ExerciseResult from './ExerciseResult';
import SummarySection from './SummarySection';
import { useNavigate } from 'react-router-dom';

const CompletedWorkoutView = ({ workout }) => {
    const navigate = useNavigate();
    return (
        <>
        <div className="d-flex align-items-center mb-4">
            <Button 
                variant="outline-primary"
                onClick={() => navigate(-1)}
                className="me-3"
            >
                Back
            </Button>
            <h2 className="flex-grow-1 mb-0 text-center">
                {workout.splitName} - Day {workout.day}
            </h2>
        </div>    
            <SummarySection workout={workout} />
            
            {workout.lifts.map(lift => (
                <ExerciseResult
                    key={lift.id}
                    lift={lift}
                />
            ))}
        </>
    );
};

export default CompletedWorkoutView;