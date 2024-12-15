import React from 'react';
import CalenderParent from './CalendarParent';

const CalendarContainer = ({ workouts, updateWorkouts, setWorkouts }) => {
    return (
        <CalenderParent workouts={workouts} updateWorkouts={updateWorkouts} setWorkouts={setWorkouts} />
    );
};

export default CalendarContainer;