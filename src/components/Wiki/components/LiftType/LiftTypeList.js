import React, { useState } from 'react';
import { Row, Col, Spinner, Card, Badge, Button, Collapse } from 'react-bootstrap';
import workoutDescriptionService from '../../../../services/workoutDescription';

const LiftTypeList = ({ liftTypes, loading }) => {
    const [state, setState] = useState({
        loading: false,
        showInstructions: false,
        error: null
    });
    
    // update state handler
    const updateState = (field, item) => {
        setState(prev => ({
            ...prev,
            [field]: item
        }));
    };


    // function to generate the description for the exercise via backend cloud function
    const generateDescription = async (liftType) => {
        try {
            const { description, instructions } = await workoutDescriptionService.generateWorkoutDescription(liftType);
            await workoutDescriptionService.updateLiftTypeDetails(liftType.id, description, instructions);
            
            // set it internally for our use rather than fetching it again
            liftType.set('desc', description);
            liftType.set('instructions', instructions);
            updateState('showInstructions', true);
        } catch (error) {
            console.error('Error generating description:', error);
            updateState('error', 'Failed to generate description. Please try again.');
        } finally {
            updateState('loading', false);
        }
    };

    // have to format the instructinos bc gpt returns a bad string
    const formatInstructions = (liftType) => {
        const text = liftType.get('instructions')
        if (!text) return [];
        
        return text.split('\n')
            .map(line => line.trim())           // remove leading/trailing whitespace
            .filter(line => line.length > 0)    // remove empty lines
            .map(line => {
                // remove number/bullet prefixes but keep the content
                return line.replace(/^\d+\.\s*|-\s*/, '').trim();
            });
    };
    
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
    if (liftTypes.length === 0) {
        return (
            <div className="text-center py-4">
                <p>No exercises found matching your criteria.</p>
            </div>
        );
    }
    // Display the list of exercise cards
    return (
        <Row xs={1} md={2} className="g-4">
            {liftTypes.map(liftType => {
                return (
                    <Col key={liftType.id}>
                                <Card className="exercise-card">
                                    <Card.Body>
                                        {/* header */}
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <Card.Title className="mb-2">{liftType.get('name')}</Card.Title>
                                                <Card.Text className="text-muted mb-2">
                                                    {liftType.get('desc')}
                                                </Card.Text>
                                            </div>
                                            {/* badge for level */}
                                            <Badge bg={
                                                liftType.get('level') === 'Beginner' ? ('success') : (liftType.get('level') === 'Intermediate' ? ('warning') : ('danger'))
                                                }>
                                                {liftType.get('level')}
                                            </Badge>
                                        </div>
                                        
                                        {/* tags for bodyparts, equipment, and type */}
                                        <div className="d-flex gap-2 flex-wrap mb-3">
                                            <Badge bg="secondary" pill className="px-3 py-2">
                                            {liftType.get('bodyPart')}
                                            </Badge>
                                            <Badge bg="info" pill className="px-3 py-2">
                                                {liftType.get('equipment')}
                                            </Badge>
                                            <Badge bg="dark" pill className="px-3 py-2">
                                            {liftType.get('type')}
                                            </Badge>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            {liftType.get('desc') || liftType.get('instructions') ? (
                                                <Button
                                                    variant={state.showInstructions ? "primary" : "outline-primary"}
                                                    onClick={() => updateState('showInstructions', !state.showInstructions)}
                                                    className="px-4"
                                                >
                                                    {state.showInstructions ? 'Hide Instructions' : 'View Instructions'}
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="primary"
                                                    onClick={() => generateDescription(liftType)}
                                                    disabled={state.loading}
                                                    className="px-4"
                                                >
                                                    {state.loading ? (
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

                                        {/* Instructions Content */}
                                        <Collapse in={state.showInstructions}>
                                            <div className="exercise-details mt-3">
                                                { liftType.get('instructions') && (
                                                    <div>
                                                        <h6 className="border-top pt-3 mb-3">Instructions</h6>
                                                        <ol>
                                                            {formatInstructions(liftType).map((step, index) => (
                                                                <li key={index} className="mb-2">
                                                                    {step}
                                                                </li>
                                                            ))}
                                                        </ol>
                                                    </div>
                                                )}
                                            </div>
                                        </Collapse>
                                    </Card.Body>
                                </Card>
                    </Col>
                );
        })}
        </Row>
    );
};
export default LiftTypeList;