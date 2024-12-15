import React, { useState, useMemo } from 'react';
import { Badge, Button, Card, Container, ListGroup, Stack, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import '../styles/calendarStyle.css';
import { useNavigate } from 'react-router-dom';
dayjs.extend(utc);


const WeekView = ({ selectedDate, getWorkoutsForDay, getWorkoutLength }) => {
    const navigate = useNavigate();
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        return selectedDate ? dayjs(selectedDate).startOf('week') : dayjs().startOf('week');
    });
    
    // Create an array of objects representing each day of the week
    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, index) => {
            const date = currentWeekStart.add(index, 'day');
            return {
                date,
                dayName: date.format('dddd'),
                dayNumber: date.format('D'),
                isToday: date.isSame(dayjs(), 'day')
            };
        });
    }, [currentWeekStart]);

    return (
        <Container fluid>
            <Card className="mb-4 bg-white border-0 align-items-center">
                <Card.Header className="d-flex bg-white border-0">
                    <h5 className="mb-2 text-center">Week of {currentWeekStart.format('MMMM D, YYYY')}</h5>
                </Card.Header>
                <Card.Body className="p-0">
                    <Stack direction="horizontal" gap={2} className="text-center">
                        <Button 
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => setCurrentWeekStart(currentWeekStart.subtract(1, 'week'))}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="outline-primary"
                            size="sm"
                            onClick={() => setCurrentWeekStart(dayjs().startOf('week'))}
                        >
                            Today
                        </Button>
                        <Button 
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => setCurrentWeekStart(currentWeekStart.add(1, 'week'))}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Stack>
                </Card.Body>
            </Card>
                <ListGroup className="border-0 week-view-list">
                    {weekDays.map(({ date, dayName, dayNumber, isToday }) => {
                        const dayWorkouts = getWorkoutsForDay(date);
                        return (
                            <ListGroup.Item 
                                key={date.format('YYYY-MM-DD')}
                                className={`${isToday ? 'border-start border-primary border-start-4 border-top border-top-4' : ''}`}                        >
                                <div className="d-flex align-items-center mb-3">
                                    <div>
                                        <strong>{dayName}</strong>
                                        <span className="text-muted ms-2">{dayNumber}</span>
                                    </div>
                                    {isToday && (
                                        <Badge bg="primary" pill className="ms-2">Today</Badge>
                                    )}
                                </div>

                                <div className="workout-cell">
                                    {dayWorkouts ? (
                                        dayWorkouts.map((workout) => (
                                            <div
                                                key={workout.id}
                                                className="workout-card mb-3"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/workout/${workout.id}`, { state: { workout } });
                                                }}
                                            >
                                            <OverlayTrigger key="top" placement="top" overlay={<Tooltip id="tooltip-top">Click to see your workout</Tooltip>}>
                                                <Card>
                                                    <Card.Header className="py-2">
                                                        <strong>
                                                            {workout.bodyParts.join(', ') || ''} Day
                                                        </strong>
                                                        <br />
                                                        <Stack direction="horizontal" gap={2} className="mt-1">
                                                            <Badge bg="info" pill>
                                                                {workout.splitName}
                                                            </Badge>
                                                            <Badge bg="primary" pill>
                                                                Day: {workout.day}
                                                            </Badge>
                                                            {workout.completed ? (
                                                                <Badge bg="success" pill className="ms-2">Completed</Badge>
                                                            ) : (
                                                                <Badge bg="danger" pill className="ms-2">Incomplete</Badge>
                                                            )}
                                                        </Stack>
                                                    </Card.Header>
                                                    <Card.Body className="py-2">
                                                        <Table hover className="mb-0">
                                                            <thead className="bg-light"> 
                                                                <tr>
                                                                    <th>Exercise</th>
                                                                    <th>Sets</th>
                                                                    <th>Reps</th>
                                                                    <th>Weight</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {workout.lifts.map((lift, index) => (
                                                                    <tr key={index}>
                                                                        <td>{lift.name}</td>
                                                                        <td>{lift.sets}</td>
                                                                        <td>{lift.reps}</td>
                                                                        <td>{lift.weight > 0 ? (`${lift.weight} lbs`) : (`Bodyweight`)}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </Card.Body>
                                                </Card>
                                            </OverlayTrigger>

                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted text-center py-3">
                                            No workouts scheduled
                                        </div>
                                    )}
                                </div>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
        </Container>
    );
};

export default WeekView;