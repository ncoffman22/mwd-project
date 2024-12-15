import React, { useState } from 'react';
import { Button, Spinner, Form } from 'react-bootstrap';
import openAiService from '../../../services/openAIService';

const AutoWorkoutForm = ({ formData, dayKey, onWorkoutsGenerated, user }) => {
    // onWorkoutsGenerated={(lifts) => handleUpdate('autoGenerate', lifts)}
    const [generationState, setGenerationState] = useState({
        loading: false,
        error: '',
        description: '',
        userLevel: 'intermediate'
    });

    // handleGenerateWorkout function to generate the workout
    const handleGenerateWorkout = async () => {
        if (generationState.loading) return;

        setGenerationState({
            ...generationState,
            loading: true,
            error: ''
        });

        try {
            const dayParts = formData.selectedSplit.get(dayKey) || [];
            const generatedWorkout = await openAiService.generateWorkout(
                dayParts,
                generationState.description,
                generationState.userLevel,
                user.id
            );
            onWorkoutsGenerated(generatedWorkout);
            setGenerationState(prev => ({
                ...prev,
                loading: false,
                description: '',
                error: ''
            }));
        } catch (error) {
            console.error('Error generating workout:', error);
            setGenerationState(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to generate workout. Please try again.'
            }));
        }
    };


    return (
        <div>
            <h5>Generate AI Workout</h5>
            <div className="mb-3">
                <Form.Group className="mb-3">
                    <Form.Label>Fitness Level</Form.Label>
                    <Form.Select
                        value={generationState.userLevel}
                        onChange={(e) => setGenerationState(prev => ({
                            ...prev,
                            userLevel: e.target.value
                        }))}
                        disabled={generationState.loading}
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
                        value={generationState.description}
                        onChange={(e) => setGenerationState(prev => ({
                            ...prev,
                            description: e.target.value
                        }))}
                        placeholder="E.g., focus on strength, include supersets, time constraints, etc."
                    />
                </Form.Group>

                {generationState.error && (
                    <div className="alert alert-danger" role="alert">
                        {generationState.error}
                    </div>
                )}

                <div className="d-grid">
                    <Button 
                        onClick={handleGenerateWorkout}
                        variant="primary" 
                        disabled={generationState.loading}
                    >
                        {generationState.loading ? (
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
        </div>
    );
};

export default AutoWorkoutForm;