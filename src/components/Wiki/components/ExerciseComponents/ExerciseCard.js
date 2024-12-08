import React, { useState } from 'react';
import { Card, Badge, Button, Spinner, Collapse } from 'react-bootstrap';
import workoutDescriptionService from '../../../../services/workoutDescription';
import Display from './Displays';

const ExerciseCard = ({ exercise }) => {
    const [loading, setLoading] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [error, setError] = useState(null);
    
    // Function to get the variant for the level badge for color
    const getLevelVariant = (level) => {
        switch (level) {
            case 'Beginner':
                return 'success';
            case 'Intermediate':
                return 'warning';
            case 'Expert':
                return 'danger';
            default:
                return 'success';
        }
    };

    // function to generate the description for the exercise via backend cloud function
    const handleGenerateDescription = async () => {
        setLoading(true);
        setError(null);
        try {
            const { description, instructions } = await workoutDescriptionService.generateWorkoutDescription(exercise);
            await workoutDescriptionService.updateLiftTypeDetails(exercise.id, description, instructions);
            
            exercise.set('desc', description);
            exercise.set('instructions', instructions);
            setShowInstructions(true);
        } catch (error) {
            console.error('Error generating description:', error);
            setError('Failed to generate description. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const hasDetails = exercise.get('desc') || exercise.get('instructions');

    return (
        <Card className="exercise-card">
            <Card.Body>
                {/* Exercise Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <Card.Title className="mb-2">{exercise.get('name')}</Card.Title>
                        <Card.Text className="text-muted mb-2">
                            {exercise.get('desc')}
                        </Card.Text>
                    </div>
                    <Badge bg={getLevelVariant(exercise.get('level'))}>
                        {exercise.get('level')}
                    </Badge>
                </div>
                
                {/* Exercise Tags */}
                <div className="d-flex gap-2 flex-wrap mb-3">
                    <Badge bg="secondary" className="px-3 py-2">
                        <i className="bi bi-person"></i> {exercise.get('bodyPart')}
                    </Badge>
                    <Badge bg="info" className="px-3 py-2">
                        <i className="bi bi-gear"></i> {exercise.get('equipment')}
                    </Badge>
                    <Badge bg="dark" className="px-3 py-2">
                        <i className="bi bi-activity"></i> {exercise.get('type')}
                    </Badge>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    {hasDetails ? (
                        <Button
                            variant={showInstructions ? "primary" : "outline-primary"}
                            onClick={() => setShowInstructions(!showInstructions)}
                            className="px-4"
                        >
                            {showInstructions ? 'Hide Instructions' : 'View Instructions'}
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={handleGenerateDescription}
                            disabled={loading}
                            className="px-4"
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Generating...
                                </>
                            ) : (
                                'Generate Description'
                            )}
                        </Button>
                    )}
                </div>

                {error && (
                    <div className="text-danger mt-2 small">
                        {error}
                    </div>
                )}

                {/* Instructions Content */}
                <Collapse in={showInstructions}>
                    <div className="exercise-details mt-3">
                        { exercise.get('instructions') && (
                            <Display 
                                instructions={exercise.get('instructions')}
                            />
                        )}
                    </div>
                </Collapse>
            </Card.Body>
        </Card>
    );
};
export default ExerciseCard;