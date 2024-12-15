import React from 'react';
import dayjs from 'dayjs';
import { Card, Row, Col } from 'react-bootstrap';
import NextWorkoutCard from './NextWorkoutCard';
import GoalProgressCard from './GoalProgressCard';

const HomeTabParent = ({ data, user }) => {
    const getNextPlannedWorkout = (workouts) => {
        const today = dayjs().startOf('day');
        
        const futureWorkouts = workouts
            .filter(workout => dayjs(workout.date).isAfter(today) || dayjs(workout.date).isSame(today, 'day'))
            .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
        
        for (let i = 0; i < futureWorkouts.length; i++) {
            const workout = futureWorkouts[i];
            if (dayjs(workout.date).isAfter(today) && workout.completed === false) {
                return workout;
            }
        }
        return null;
    };


    const nextWorkout = getNextPlannedWorkout(data.workouts);
    const goals = user?.get('goals') || {};

    // Filter out any null or undefined values
    const validGoals = Object.entries(goals).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
            acc.push({ key, value }); // Push an object with key-value pairs
        }
        return acc;
    }, []);

    const goalKeys = validGoals.map(goal => goal.key);

    // Find liftTypes for each goalKey and map to their names
    const liftTypeNames = goalKeys.map(key => {
        const liftType = data.liftTypes.find(lt => lt.id === key);
        return liftType ? liftType.get('name') : null; // Return the name or null if not found
    }).filter(name => name !== null); // Filter out any null values
    
    const liftTypeIds = goalKeys.map(key => {
        const liftType = data.liftTypes.find(lt => lt.id === key);
        return liftType ? liftType.id : null; // Return the id or null if not found
    });
    // Extract values from validGoals
    const goalValues = validGoals.map(goal => goal.value);
    return (
        <Row className="mt-4">
            <Col lg={6} className="mb-4">
                <Card className="mb-4">
                    <Card.Header className="bg-primary text-white">
                        <h5 className="mb-0">Next Workout</h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {nextWorkout ? (
                            <NextWorkoutCard workout={nextWorkout} />
                        ) : (
                            <div className="text-center p-4">
                                <p>No upcoming workouts planned. Add a workout to get started.</p>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={6}>
                <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
                        <h5 className="mb-0">Goal Progress</h5>
                        <span className="text-white">
                            {Object.keys(validGoals).length} Active Goals
                        </span>
                    </Card.Header>
                    <Card.Body>
                        {Object.keys(validGoals).length > 0 ? (
                            Array.from({ length: liftTypeNames.length }).map((_, index) => {
                                const liftName = liftTypeNames[index];
                                const liftTypeId = liftTypeIds[index];
                                const goalValue = goalValues[index];
                                if (!liftName) return null;

                                return (
                                    <GoalProgressCard
                                        goalValue={goalValue}
                                        liftName={liftName}
                                        liftId={liftTypeId}
                                        stats={data.statistics}
                                    />
                                );
                            })
                        ) : (
                            <div className="text-center py-4">
                                <p className="mb-0">No goals set yet. Set some goals to track your progress!</p>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default HomeTabParent;