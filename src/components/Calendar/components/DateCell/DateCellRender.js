import React from 'react';
import { Badge, Typography } from 'antd';
import dayjs from 'dayjs';

const { Text } = Typography;

const DateCellRender = ( {value, workouts, handleWorkoutClick}) => {
    if (!Array.isArray(workouts)) return null;

    const date = value.toDate();
    const dayWorkouts = workouts.filter(workout => {
        const workoutDate = dayjs(workout.date);
        return workoutDate.isSame(dayjs(date), 'day');
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