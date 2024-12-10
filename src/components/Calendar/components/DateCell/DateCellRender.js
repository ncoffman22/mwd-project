import React from 'react';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const { Text } = Typography;

const DateCellRender = ({ value, workouts, handleWorkoutClick }) => {
    if (!Array.isArray(workouts)) return null;

    const date = value.startOf('day');
    const dayWorkouts = workouts.filter(workout => {
        // Convert datePerformed to start of day for comparison
        const workoutDate = dayjs(workout.date).startOf('day');
        return workoutDate.isSame(date, 'day');
    });

    return (
        <ul className="p-0 m-0 list-none">
            {dayWorkouts.map((workout) => (
                <li 
                    key={workout.id} 
                    className="mb-1 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleWorkoutClick(workout);
                    }}
                >
                    <Text strong>
                        {workout.splitName}
                    </Text> 
                    <br />
                    <Text>
                        Day {workout.day}
                    </Text>
                    {workout.totalExercises > 0 && (
                        <Text type="secondary">
                            <br />{workout.totalExercises} exercises
                        </Text>
                    )}
                </li>
            ))}
        </ul>
    );
};
export default DateCellRender;