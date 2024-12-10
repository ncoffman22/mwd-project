import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import CalendarChild from './CalendarChild';
import authService from '../../services/authService';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getCachedUserLifts, getCachedUserWorkouts, getCachedUserLiftTypes } from '../../services/cacheService';

// Enable UTC and timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const CalendarParent = ({ }) => {
    const [calendarWorkouts, setCalendarWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadWorkoutData = async () => {
            try {
                const currentUser = authService.getCurrentUser();
                if (!currentUser) {
                    setError("No user logged in");
                    return;
                }

                // Get all workouts for the current user
                const userWorkouts = await getCachedUserWorkouts(currentUser.id);
                const userLifts = await getCachedUserLifts(currentUser.id);
                const liftTypes = await getCachedUserLiftTypes(currentUser.id);
                const processedWorkouts = [];
                for (let i = 0; i < userWorkouts.length; i++) {
                    const workout = userWorkouts[i];
                    const liftPromises = [];
                    // Gather all lifts from the workout (lift1 through lift8)
                    for (let i = 1; i <= 8; i++) {
                        const liftKey = `lift${i}`;
                        const lift = workout.get(liftKey);
                        if (lift) {
                            try {
                                const liftData = await userLifts.find((l) => l.id === lift.id);
                                liftPromises.push(liftData);
                            } catch (error) {
                                console.error(`Error fetching lift ${i}:`, error);
                            }
                        }
                    }

                    const lifts = await Promise.all(liftPromises);
                    const liftDetails = await Promise.all(
                        lifts.map(async (lift) => {
                            if (!lift) return null;
                            
                            try {
                                const liftType = lift.get('liftType');
                                const liftTypeDetails = await liftTypes.filter((lt) => lt.id === liftType.id);
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
                                    liftType: liftType
                                };
                            } catch (error) {
                                console.error('Error processing lift details:', error);
                                return null;
                            }
                        })
                    );

                    const validLifts = liftDetails.filter(Boolean);

                    // Get the datePerformed and adjust for timezone
                    const datePerformed = workout.get('datePerformed');
                    const adjustedDate = dayjs(datePerformed)
                        .add(datePerformed.getTimezoneOffset(), 'minutes')
                        .toDate();

                    processedWorkouts.push( {
                        id: workout.id,
                        completed: workout.get('completed'),
                        date: adjustedDate, // Use the timezone-adjusted date
                        split: workout.get('split') ? workout.get('split') : null,
                        splitName: workout.get('split') ? workout.get('split').get('name') : 'No Split',
                        day: workout.get('day') || 'Unassigned',
                        lifts: validLifts,
                        totalExercises: validLifts.length,
                        originalWorkout: workout
                    });
                }
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

    if (error) {
        return (
            <Card className="w-full">
                <div className="text-red-500">Error loading workouts: {error}</div>
            </Card>
        );
    }

    return (
        <CalendarChild workouts={calendarWorkouts} />
    );
};

export default CalendarParent;