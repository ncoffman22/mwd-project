import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import WorkoutHeader from '../WorkoutHeader';
import ExerciseResult from './ExerciseResult';
import SummarySection from './SummarySection';
import workoutsService from '../../../../services/workoutsService';
import liftsService from '../../../../services/liftsService';

const CompletedWorkoutView = ({ workout, onWorkoutUpdate }) => {
    const [editing, setEditing] = useState(false);
    
    // Toggle editing mode
    const handleEdit = () => {
        setEditing(!editing);
    };

    const handleSave = async (updatedExercise) => {
        try {
            // Update the individual lift
            await liftsService.updateLift(updatedExercise.id, {
                weight: updatedExercise.weight,
                passedSets: updatedExercise.passedSets || [],
                failedSets: updatedExercise.failedSets || [],
                setDetails: updatedExercise.setDetails || {}
            });

            // Update the workout data in state
            onWorkoutUpdate(prevWorkout => ({
                ...prevWorkout,
                lifts: prevWorkout.lifts.map(lift => 
                    lift.id === updatedExercise.id ? updatedExercise : lift
                )
            }));

            // Update the overall workout if needed
            await workoutsService.updateWorkout(workout.id, {
                ...workout,
                lifts: workout.lifts.map(lift => 
                    lift.id === updatedExercise.id ? updatedExercise : lift
                )
            });
        } catch (error) {
            console.error('Error updating exercise:', error);
        }
    };

    return (
        <>
            <WorkoutHeader 
                title={workout.splitName} 
                day={workout.day}
                rightContent={
                    <Button
                        variant="primary"
                        onClick={handleEdit}
                        className="ms-3"
                    >
                        {editing ? 'Save Changes' : 'Edit Results'}
                    </Button>
                }
            />
            
            <SummarySection workout={workout} />
            
            {workout.lifts.map(exercise => (
                <ExerciseResult
                    key={exercise.id}
                    exercise={exercise}
                    editable={editing}
                    onSave={handleSave}
                />
            ))}
        </>
    );
};

export default CompletedWorkoutView;