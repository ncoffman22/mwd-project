import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import CalendarChild from './CalendarChild';
import authService from '../../services/authService';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getCachedUserWorkouts } from '../../services/cacheService';

dayjs.extend(utc);
dayjs.extend(timezone);

const CalendarParent = () => {
    const [data, setData] = useState({
        workouts: [],
        loading: true,
        error: null
    });

    const currentUser = authService.getCurrentUser();
    
    useEffect(() => {
        const loadWorkoutData = async () => {
            try {
                const userWorkouts = await getCachedUserWorkouts(currentUser.id);

                const processedWorkouts = await Promise.all(userWorkouts.map(async (workout) => {
                    const workoutLifts = [];
                    
                    // Process lifts 1-8 directly from workout object
                    for (let i = 1; i <= 8; i++) {
                        const liftPointer = workout.get(`lift${i}`);
                        if (!liftPointer) continue;
                        
                        try {
                            // Get the lift type from the lift pointer
                            const liftType = liftPointer.get('liftType');
                            if (!liftType) continue;

                            workoutLifts.push({
                                id: liftPointer.id,
                                name: liftType.get('name'),
                                sets: liftPointer.get('sets'),
                                reps: liftPointer.get('reps'),
                                weight: liftPointer.get('weight'),
                                type: liftType.get('type'),
                                bodyPart: liftType.get('bodyPart'),
                                completed: liftPointer.get('completed'),
                                passedSets: liftPointer.get('passedSets') || [],
                                failedSets: liftPointer.get('failedSets') || []
                            });
                            
                        } catch (error) {
                            console.warn(`Error processing lift${i}:`, error);
                        }
                    }

                    const split = workout.get('split');
                    const day = workout.get('day');
                    const datePerformed = workout.get('datePerformed');
                    const adjustedDate = dayjs(datePerformed)
                        .add(datePerformed.getTimezoneOffset(), 'minutes')
                        .toDate();


                    return {
                        id: workout.id,
                        completed: workout.get('completed'),
                        date: adjustedDate,
                        split: split,
                        bodyParts: split ? split.get(`day${day}`) : [],
                        splitName: split ? split.get('name') : 'No Split',
                        day: day || 'Unassigned',
                        lifts: workoutLifts,
                        totalExercises: workoutLifts.length
                    };
                }));


                setData({
                    workouts: processedWorkouts, // need to create a custom obj to make this work correctly
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error('Error loading workout data:', error);
                setData(prev => ({
                    ...prev,
                    loading: false,
                    error: error.message
                }));
            }
        };

        loadWorkoutData();
    }, [currentUser.id]);

	if (data.loading) {
		return (
			<div>
				<h2>Loading...</h2>
				<Spinner animation="border" role="status">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			</div>
		)
	}

    return <CalendarChild data={data} />;
};

export default CalendarParent;