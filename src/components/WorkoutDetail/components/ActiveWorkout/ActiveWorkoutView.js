import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LiftCard from './LiftCard';
import ProgressSection from './ProgressSection';
import workoutsService from '../../../../services/workoutsService';
import liftsService from '../../../../services/liftsService';

const ActiveWorkoutView = ({ workout, onWorkoutUpdate }) => {
    const [editable, setEditable] = useState(false);
    const [liftProgress, setLiftProgress] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // handle the completion of a set
    const handleSetComplete = async (liftId, setIndex, status) => {
        if (isSubmitting) return;

        // Update the set status in state
        try {
            setLiftProgress(prev => {
                // go through the previous state and update the exercise
                const currentLift = prev[liftId] || { passedSets: [], failedSets: [] };
                const updatedLift = {
                    ...currentLift,
                    passedSets: status === 'passed' 
                        ? [...new Set([...currentLift.passedSets, setIndex])]
                        : currentLift.passedSets.filter(set => set !== setIndex),
                    failedSets: status === 'failed'
                        ? [...new Set([...currentLift.failedSets, setIndex])]
                        : currentLift.failedSets.filter(set => set !== setIndex)
                };
                
                return {
                    ...prev,
                    [liftId]: updatedLift
                };
            });
            
            // Update the lift in the database if all sets are completed
            const lift = workout.lifts.find(ex => ex.id === liftId);
            if (!lift) return;
            
            // Calculate the total number of sets attempted
            const currentProgress = liftProgress[liftId] || { passedSets: [], failedSets: [] };
            const totalAttempted = currentProgress.passedSets.length + currentProgress.failedSets.length;
            
            // If all sets are completed, update the lift
            if (totalAttempted === lift.sets) {
                const success = currentProgress.passedSets.length / lift.sets >= 0.5;
                await liftsService.updateLift(liftId, {
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
    const handleWeightUpdate = async (liftId, weight) => {
        if (isSubmitting) return;

        try {
            await liftsService.updateLift(liftId, {
                weight: Number(weight)
            });
            
            onWorkoutUpdate({
                ...workout,
                lifts: workout.lifts.map(lift => 
                    lift.id === liftId 
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
            await workoutsService.updateWorkout(workout.id, {
                completed: true,
                completedAt: new Date()
            });

            await Promise.all(workout.lifts.map(lift => {
                const progress = liftProgress[lift.id] || { passedSets: [], failedSets: [] };

                return liftsService.updateLift(lift.id, {
                    completed: true,
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
            const progress = liftProgress[lift.id] || { passedSets: [], failedSets: [] };
            totalAttemptedSets += progress.passedSets.length + progress.failedSets.length;
            totalSets += lift.sets;
        });

        return Math.round((totalAttemptedSets / totalSets) * 100);
    };

    // just a simple check to see if the workout is complete
    const isWorkoutComplete = calculateOverallProgress() === 100;

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
            <Button
                        variant="primary"
                        onClick={() => setEditable(!editable)}
                        className="ms-3"
                        disabled={isSubmitting}
                    >
                        {editable ? 'Save Changes' : 'Edit Weights'}
            </Button>
        </div>

            <ProgressSection 
                progress={calculateOverallProgress()}
                isComplete={isWorkoutComplete}
                passedSets={Object.values(liftProgress).reduce((total, curr) => 
                    total + (curr.passedSets?.length || 0), 0)}
                failedSets={Object.values(liftProgress).reduce((total, curr) => 
                    total + (curr.failedSets?.length || 0), 0)}
            />

            {workout.lifts.map((lift) => (
                <LiftCard
                    key={lift.id}
                    lift={lift}
                    progress={liftProgress[lift.id]}
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