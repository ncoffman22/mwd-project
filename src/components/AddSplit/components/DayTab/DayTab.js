import React from 'react';
import { Button, Card, ListGroup,  Badge } from 'react-bootstrap';

const BODY_PARTS = [
    'Abdominals', 'Adductors', 'Abductors', 'Biceps', 'Calves', 'Chest',
    'Forearms', 'Glutes', 'Hamstrings', 'Lats', 'Lower Back', 'Middle Back',
    'Traps', 'Neck', 'Quadriceps', 'Shoulders', 'Triceps'
];

const DayTab = ({ dayKey, dayNum, selectedParts, onBodyPartChange }) => {
    return(
        <Card className="mt-3 border-0">
            <Card.Body>
                <h5 className="mb-3">Select Body Parts for Day {dayNum}</h5>
                <div className="d-flex flex-wrap gap-2 mb-4">
                    {BODY_PARTS.map(part => (
                        <Badge
                            key={part}
                            bg={selectedParts.includes(part) ? "primary" : "secondary"}
                            style={{ cursor: 'pointer' }}
                            onClick={() => onBodyPartChange(dayNum, part)}
                            className="p-2"
                        >
                            {part}
                        </Badge>
                    ))}
                </div>

                {selectedParts.length > 0 && (
                    <div className="mt-4">
                        <h5>Selected Body Parts</h5>
                        <ListGroup>
                            {selectedParts.map((part, index) => (
                                <ListGroup.Item
                                    key={index}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <span>{part}</span>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => onBodyPartChange(dayNum, part)}
                                    >
                                        Remove
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};
export default DayTab;