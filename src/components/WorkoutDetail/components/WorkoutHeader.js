import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const WorkoutHeader = ({ title, day, rightContent }) => {
    const navigate = useNavigate();

    // This component is used to display the header of the workout detail page with a back button.
    return (
        <div className="d-flex align-items-center mb-4">
            <Button 
                variant="outline-primary"
                onClick={() => navigate(-1)}
                className="me-3"
            >
                Back
            </Button>
            <h2 className="flex-grow-1 mb-0 text-center">
                {title} - Day {day}
            </h2>
            {rightContent}
        </div>
    );
};

export default WorkoutHeader;