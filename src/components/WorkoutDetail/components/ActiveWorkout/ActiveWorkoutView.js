import React, { useState } from 'react';
import { Button, Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import WorkoutHeader from '../WorkoutHeader';
import ExerciseCard from './ExerciseCard';
import ProgressSection from './ProgressSection';
import workoutsService from '../../../../services/workoutsService';
import liftsService from '../../../../services/liftsService';

const ActiveWorkoutView = ({ workout, onWorkoutUpdate }) => {
    const [editable, setEditable] = useState(false);
    const [exerciseProgress, setExerciseProgress] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // If the workout is not loaded yet, show a loading spinner
    if (!workout) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    // handle the completion of a set
    const handleSetComplete = async (exerciseId, setIndex, status) => {
        if (isSubmitting) return;

        // Update the set status in state
        try {
            setExerciseProgress(prev => {
                // go through the previous state and update the exercise
                const currentExercise = prev[exerciseId] || { passedSets: [], failedSets: [] };
                const updatedExercise = {
                    ...currentExercise,
                    passedSets: status === 'passed' 
                        ? [...new Set([...currentExercise.passedSets, setIndex])]
                        : currentExercise.passedSets.filter(set => set !== setIndex),
                    failedSets: status === 'failed'
                        ? [...new Set([...currentExercise.failedSets, setIndex])]
                        : currentExercise.failedSets.filter(set => set !== setIndex)
                };
                
                return {
                    ...prev,
                    [exerciseId]: updatedExercise
                };
            });
            
            // Update the lift in the database if all sets are completed
            const exercise = workout.lifts.find(ex => ex.id === exerciseId);
            if (!exercise) return;
            
            // Calculate the total number of sets attempted
            const currentProgress = exerciseProgress[exerciseId] || { passedSets: [], failedSets: [] };
            const totalAttempted = currentProgress.passedSets.length + currentProgress.failedSets.length;
            
            // If all sets are completed, update the lift
            if (totalAttempted === exercise.sets) {
                const success = currentProgress.passedSets.length / exercise.sets >= 0.5;
                await liftsService.updateLift(exerciseId, {
                    completed: true,
                    success: success,
                    passedSets: currentProgress.passedSets,
                    failedSets: currentProgress.failedSets
                });
            }
        } catch (error) {
            console.error('Error updating set status:', error);
        }
    };

    // handle the update of the weight for an exercise
    const handleWeightUpdate = async (exerciseId, setIndex, weight) => {
        if (isSubmitting) return;

        try {
            await liftsService.updateLift(exerciseId, {
                weight: Number(weight)
            });
            
            onWorkoutUpdate({
                ...workout,
                lifts: workout.lifts.map(lift => 
                    lift.id === exerciseId 
                        ? { ...lift, weight: Number(weight) }
                        : lift
                )
            });
        } catch (error) {
            console.error('Error updating weight:', error);
        }
    };

    // handle the completion of the workout
    const handleComplete = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await workoutsService.updateWorkout(workout.originalWorkout.id, {
                completed: true,
                completedAt: new Date()
            });

            await Promise.all(workout.lifts.map(exercise => {
                const progress = exerciseProgress[exercise.id] || { passedSets: [], failedSets: [] };
                const success = progress.passedSets.length / exercise.sets >= 0.5;

                return liftsService.updateLift(exercise.id, {
                    completed: true,
                    success: success,
                    passedSets: progress.passedSets,
                    failedSets: progress.failedSets
                });
            }));

            navigate('/calendar');
        } catch (error) {
            console.error('Error completing workout:', error);
            setIsSubmitting(false);
        }
    };

    // calculate the overall progress of the workout
    const calculateOverallProgress = () => {
        if (!workout?.lifts?.length) return 0;
        
        let totalAttemptedSets = 0;
        let totalSets = 0;

        workout.lifts.forEach(lift => {
            const progress = exerciseProgress[lift.id] || { passedSets: [], failedSets: [] };
            totalAttemptedSets += progress.passedSets.length + progress.failedSets.length;
            totalSets += lift.sets;
        });

        return Math.round((totalAttemptedSets / totalSets) * 100);
    };

    // just a simple check to see if the workout is complete
    const isWorkoutComplete = calculateOverallProgress() === 100;

    return (
        <>
            <WorkoutHeader 
                title={workout.splitName || 'Workout'}
                day={workout.day}
                rightContent={
                    <Button
                        variant="primary"
                        onClick={() => setEditable(!editable)}
                        className="ms-3"
                        disabled={isSubmitting}
                    >
                        {editable ? 'Save Changes' : 'Edit Weights'}
                    </Button>
                }
            />

            <ProgressSection 
                progress={calculateOverallProgress()}
                isComplete={isWorkoutComplete}
                passedSets={Object.values(exerciseProgress).reduce((total, curr) => 
                    total + (curr.passedSets?.length || 0), 0)}
                failedSets={Object.values(exerciseProgress).reduce((total, curr) => 
                    total + (curr.failedSets?.length || 0), 0)}
            />

            {workout.lifts.map((exercise) => (
                <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    progress={exerciseProgress[exercise.id]}
                    onSetComplete={handleSetComplete}
                    onWeightUpdate={handleWeightUpdate}
                    editable={editable}
                    disabled={isSubmitting}
                />
            ))}

            {isWorkoutComplete && (
                <div className="position-fixed bottom-0 end-0 p-4">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleComplete}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Completing...
                            </>
                        ) : (
                            'Complete Workout'
                        )}
                    </Button>
                </div>
            )}
        </>
    );
};

export default ActiveWorkoutView;