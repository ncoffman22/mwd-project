import React from 'react';
import dayjs from 'dayjs';
import { Card, Badge, ListGroup, OverlayTrigger, Tooltip} from 'react-bootstrap';
import utc from 'dayjs/plugin/utc';
import { useNavigate }  from 'react-router-dom';
dayjs.extend(utc);

const DateCellRender = ({ value, getWorkoutsForDay, getWorkoutLength }) => {
    const navigate = useNavigate();    
    const date = value.startOf('day');
    const dayWorkouts = getWorkoutsForDay(date);
    return (
        <div className="workout-cell">
            {dayWorkouts.length > 0 ? (dayWorkouts.map((workout) => (
                <div
                    key={workout.id}
                    className="text-center workout-card"
                    onClick={(e) => {
                        e.stopPropagation();               
                        navigate(`/workout/${workout.id}`, { state: { workout } });
                    }}
                >
                <OverlayTrigger key="top" placement="top" overlay={<Tooltip id="tooltip-top">Click to see your workout</Tooltip>}>
                    <Card>
                        <Card.Header className="0" bg="light">
                            <strong>{workout.bodyParts.join(', ')} Day</strong>
                            <br />
                            <Badge bg="info" pill >
                                {workout.splitName}
                            </Badge>
                            <Badge bg="primary" pill>Day: {workout.day}</Badge>
                            {workout.completed ? (
                                <Badge bg="success" pill className="ms-2">Completed</Badge>
                            ) : (
                                <Badge bg="danger" pill className="ms-2">Incomplete</Badge>
                            )}
                        </Card.Header>
                        <Card.Body className="text-start">
                            <ListGroup variant="flush" style={{padding: 0, border: 'none' }}>
                                {workout.lifts?.map((lift, index) => (
                                    <ListGroup.Item key={index} style={{padding: 0, border: 'none' }}>
                                        <strong>{index+1}</strong> - {lift.name}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </OverlayTrigger>
                </div>
            ))) : null}
        </div>
    );
};

export default DateCellRender;