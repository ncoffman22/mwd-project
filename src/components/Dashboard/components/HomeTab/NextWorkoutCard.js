import React from 'react';
import { Card, Stack, Badge, OverlayTrigger, Tooltip, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NextWorkoutCard = ({ workout }) => {
    const navigate = useNavigate();

    return (
        <OverlayTrigger 
            key="top" 
            placement="top" 
            overlay={<Tooltip id="tooltip-top">Click to see your workout</Tooltip>}
        >
            <Card 
                className="cursor-pointer"
                border="0"
                onClick={() => navigate(`/workout/${workout.id}`, { state: { workout } })}
            >
                <Card.Header className="py-2">
                    <strong>
                        {workout.bodyParts.join(', ')} Day
                    </strong>
                    <br />
                    <Stack direction="horizontal" gap={2} className="mt-1">
                        <Badge bg="info" pill>
                            {workout.splitName}
                        </Badge>
                        <Badge bg="primary" pill>
                            Day: {workout.day}
                        </Badge>
                        <Badge bg="warning" pill className="ms-2">
                            Planned
                        </Badge>
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
                                    <td>{lift.weight > 0 ? (`${lift.weight} lbs`) : ('Bodyweight')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </OverlayTrigger>
    );
};
export default NextWorkoutCard;