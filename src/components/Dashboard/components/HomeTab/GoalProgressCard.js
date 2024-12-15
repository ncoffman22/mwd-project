import React from 'react';
import { Card, ProgressBar, Badge } from 'react-bootstrap';

const GoalProgressCard = ({ goalValue, liftName, liftId, stats }) => {
    // Function to filter stats and prepare oneRM data
    const getOneRMData = () => {
        // Filter stats based on the liftId
        const filteredStats = Object.entries(stats)
            .map(([key, value]) => ({ id: key, ...value })) // Convert to an array
            .filter(stat => stat.liftType.objectId === liftId); // Filter by liftId

        // Map through oneRMProgression and prepare the data
        const oneRMData = filteredStats.flatMap(stat =>
            (stat.oneRMProgression || []).map(prog => ({
                date: new Date(prog.date).toLocaleDateString(),
                weight: prog.value,
                liftType: stat.liftType?.id
            }))
        );
        // Sort by date
        oneRMData.sort((a, b) => new Date(a.date) - new Date(b.date));
        return oneRMData;
    };

    const oneRMData = getOneRMData();

    // Calculate the current max from OneRM data
    const currentMax = oneRMData.length ? Math.max(...oneRMData.map(item => item.weight)) : 0;

    // Calculate progress as a percentage
    const progressPercentage = goalValue ? Math.min((currentMax / goalValue) * 100, 100) : 0;


    return (
        <Card className="mb-3" key={liftId}>
            <Card.Body>
                <Card.Title>
                    <h5>{liftName}</h5>
                </Card.Title>
                <Badge bg="secondary">Goal: {goalValue} lbs</Badge>
                <ProgressBar now={progressPercentage} label={`${Math.round(progressPercentage)}%`} className="mt-3" />
            </Card.Body>
        </Card>
    );
};

export default GoalProgressCard;
