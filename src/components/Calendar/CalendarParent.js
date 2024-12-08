import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import CalendarChild from './CalendarChild';
import authService from '../../services/authService';
import workoutsService from '../../services/workoutsService';
import liftsService from '../../services/liftsService';
import liftTypesService from '../../services/liftTypesService';

const CalendarParent = () => {

    const [calendarWorkouts, setCalendarWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    useEffect(() => {
        const loadWorkoutData = async () => {
            try {
                const currentUser = authService.getCurrentUser();
                if (!currentUser) {
                    setError("No user logged in");
                    return;
                }

                // Get all workouts for the current user
                const userWorkouts = await workoutsService.uGetWorkout(currentUser);
                
                // Process each workout to include lift details
                const processedWorkouts = await Promise.all(
                    userWorkouts.map(async (workout) => {
                        const liftPromises = [];
                        
                        // Gather all lifts from the workout (lift1 through lift8)
                        for (let i = 1; i <= 8; i++) {
                            const liftKey = `lift${i}`;
                            const lift = workout.get(liftKey);
                            if (lift) {
                                try {
                                    // Fetch the actual lift data
                                    const liftData = await liftsService.oGetLift(lift.id);
                                    liftPromises.push(liftData);
                                } catch (error) {
                                    console.error(`Error fetching lift ${i}:`, error);
                                }
                            }
                        }

                        // Wait for all lift details to be fetched
                        const lifts = await Promise.all(liftPromises);
                        // Process lift details
                        const liftDetails = await Promise.all(
                            lifts.map(async (lift) => {
                                if (!lift) return null;
                                
                                try {
                                    const liftType = lift.get('liftType');
                                    const liftTypeDetails = await liftTypesService.oGetLiftType(liftType.id);
                                    if (!liftTypeDetails) return null;

                                    return {
                                        id: lift.id,
                                        name: liftTypeDetails[0].get('name'),
                                        sets: lift.get('sets'),
                                        reps: lift.get('reps'),
                                        weight: lift.get('weight'),
                                        type: liftTypeDetails[0].get('type'),
                                        bodyPart: liftTypeDetails[0].get('bodyPart'),
                                        completed: lift.get('completed'),
                                        passedSets: lift.get('passedSets'),
                                        failedSets: lift.get('failedSets'),
                                        liftType: liftType // Keep the original liftType pointer
                                    };
                                } catch (error) {
                                    console.error('Error processing lift details:', error);
                                    return null;
                                }
                            })
                        );
                        // Filter out any null values from liftDetails
                        const validLifts = liftDetails.filter(Boolean);

                        return {
                            id: workout.id,
                            completed: workout.get('completed'),
                            date: workout.get('datePerformed'),
                            split: workout.get('split') ? workout.get('split') : null,
                            splitName: workout.get('split') ? workout.get('split').get('name') : 'No Split',
                            day: workout.get('day') || 'Unassigned',
                            lifts: validLifts,
                            totalExercises: validLifts.length,
                            originalWorkout: workout // Keep the original workout object for reference
                        };
                    })
                );

                setCalendarWorkouts(processedWorkouts);
            } catch (error) {
                console.error('Error loading workout data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadWorkoutData();
    }, []);

    if (loading) {
        return (
            <Card className="w-full h-96 flex items-center justify-center">
                <Spin size="large" />
            </Card>
        );
    }
    return (
        <CalendarChild workouts={calendarWorkouts} />
    );
};

export default CalendarParent;