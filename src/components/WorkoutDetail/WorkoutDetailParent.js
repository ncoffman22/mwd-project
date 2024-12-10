import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';
import ActiveWorkoutView from './components/ActiveWorkout/ActiveWorkoutView';
import CompletedWorkoutView from './components/CompletedWorkout/CompletedWorkoutView';
import workoutsService from '../../services/workoutsService';

const WorkoutDetailParent = () => {
    const { workoutId } = useParams();
    const { state } = useLocation();
    const [workout, setWorkout] = useState(state?.workout || null);
    const [loading, setLoading] = useState(!state?.workout);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadWorkout = async () => {
            if (state?.workout) return;

            try {
                const workoutData = await workoutsService.oGetWorkout(workoutId);
                setWorkout(workoutData);
            } catch (error) {
                setError('Error loading workout details');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (!state?.workout) {
            loadWorkout();
        }
    }, [workoutId, state?.workout]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </Container>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }
    return (
        <div>
            {workout?.completed ? (
                <CompletedWorkoutView workout={workout} onWorkoutUpdate={setWorkout} />
            ) : (
                <ActiveWorkoutView workout={workout} onWorkoutUpdate={setWorkout} />
            )}
        </div>
    );
};
export default WorkoutDetailParent;