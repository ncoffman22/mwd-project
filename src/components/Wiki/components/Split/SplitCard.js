import React from 'react';
import { Card, Badge } from 'react-bootstrap';

const SplitCard = ({ split }) => {
    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <Card.Title>{split.get('name')}</Card.Title>
                        <Card.Text className="text-muted">
                            {split.get('description')}
                        </Card.Text>
                    </div>
                    <Badge bg="primary">
                        {split.get('days')} days/week
                    </Badge>
                </div>
            </Card.Body>
        </Card>
    );
};
export default SplitCard;
