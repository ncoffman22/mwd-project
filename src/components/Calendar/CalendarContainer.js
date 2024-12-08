import React from 'react';
import { Card } from 'antd';
import { Container } from 'react-bootstrap';
import CalenderParent from './CalendarParent';

const CalendarContainer = () => {
    return (
        <Container>
            <Card className="w-full">
                <CalenderParent  />
            </Card>
        </Container>
    );
};

export default CalendarContainer;