import React from 'react';
import { Card } from 'antd';
import { Container } from 'react-bootstrap';
import CalenderParent from './CalendarParent';

const CalendarContainer = ({ workouts, updateWorkouts, setWorkouts }) => {
    return (
        <Container>
            <Card className="w-full">
                <CalenderParent workouts={workouts} updateWorkouts={updateWorkouts} setWorkouts={setWorkouts} />
            </Card>
        </Container>
    );
};

export default CalendarContainer;