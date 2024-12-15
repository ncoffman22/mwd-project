import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import ActiveWorkoutView from './components/ActiveWorkout/ActiveWorkoutView';
import CompletedWorkoutView from './components/CompletedWorkout/CompletedWorkoutView';
import { getCachedUserWorkouts } from '../../services/cacheService';
import authService from '../../services/authService';

const WorkoutDetailParent = () => {
    const { workoutId } = useParams();
    const { state } = useLocation(); // Get the state from the location object
    const [workout, setWorkout] = useState(state?.workout || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = authService.getCurrentUser();
    
    useEffect(() => {
        const loadWorkout = async () => {
            if (state?.workout) return;
            try {
                const workoutData = await getCachedUserWorkouts(user.id);
                const workout = workoutData.find(w => w.id === workoutId);
                console.log(workout);
                setWorkout(workout);
                setLoading(false);

            } catch (error) {
                setError('Error loading workout details');
                console.error(error);
            }
        };

        if (!state?.workout) {
            loadWorkout();
        }
    }, [workoutId, state?.workout, user.id]);

    if (!loading) {
        return (
            <div className="text-center">
                <h2>Loading workout...</h2>
                <Spinner animation="border" role="status" />
            </div>
        )
    }
    if (error) {
        return (
            <Alert variant="danger">
                Sorry we cannot load your workout at this time: {error}
            </Alert>
        )
    }
    return (
        <div>
            {workout?.completed ? (
                <CompletedWorkoutView workout={workout} />
            ) : (
                <ActiveWorkoutView workout={workout} onWorkoutUpdate={setWorkout} />
            )}
        </div>
    );
};
export default WorkoutDetailParent;