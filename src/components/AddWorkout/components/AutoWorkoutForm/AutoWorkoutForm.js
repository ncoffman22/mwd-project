import React, { useState } from 'react';
import { Button, Card, Spinner, Form } from 'react-bootstrap';
import openAiService from '../../../../services/openAIService';
import authService from '../../../../services/authService';

const AutoWorkoutForm = ({ selectedSplit, activeDay, onWorkoutsGenerated }) => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userLevel, setUserLevel] = useState('intermediate');

    const handleGenerateWorkout = async () => {
        if (loading) return;

        setLoading(true);
        setError('');

        try {
            const currentUser = authService.getCurrentUser();
            
            // Get body parts for the selected day
            const dayBodyParts = selectedSplit.get(activeDay) || [];
            
            // Generate workout using OpenAI
            const generatedWorkout = await openAiService.generateWorkout(
                activeDay.replace('day', ''),
                dayBodyParts,
                description,
                userLevel,
                currentUser // Pass the user object
            );

            // Map the generated workout to our app's exercise format
            const exercises = await openAiService.mapWorkoutToExercises(generatedWorkout);
            onWorkoutsGenerated(exercises);
        } catch (error) {
            console.error('Error generating workout:', error);
            setError('Failed to generate workout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mb-4 bg-light">
            <Card.Body>
                <h5>Generate AI Workout</h5>
                <div className="mb-3">
                    <Form.Group className="mb-3">
                        <Form.Label>Fitness Level</Form.Label>
                        <Form.Select
                            value={userLevel}
                            onChange={(e) => setUserLevel(e.target.value)}
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Additional Requirements (Optional)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="E.g., focus on strength, include supersets, time constraints, etc."
                        />
                    </Form.Group>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="d-grid">
                        <Button 
                            onClick={handleGenerateWorkout}
                            variant="primary" 
                            disabled={loading}
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
                                    Generating Workout...
                                </>
                            ) : (
                                'Generate AI Workout'
                            )}
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default AutoWorkoutForm;