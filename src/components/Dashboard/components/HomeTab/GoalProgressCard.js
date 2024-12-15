import React from 'react';
import { Card, ProgressBar, Row, Col, Badge } from 'react-bootstrap';
import { Line } from 'recharts';

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
        console.log(oneRMData);
        // Sort by date
        oneRMData.sort((a, b) => new Date(a.date) - new Date(b.date));
        return oneRMData;
    };

    const oneRMData = getOneRMData();

    // Calculate the current max from OneRM data
    const currentMax = oneRMData.length ? Math.max(...oneRMData.map(item => item.weight)) : 0;

    // Calculate progress as a percentage
    const progressPercentage = goalValue ? Math.min((currentMax / goalValue) * 100, 100) : 0;

    // Prepare data for the chart
    const chartData = {
        labels: oneRMData.map(item => item.date),
        datasets: [
            {
                label: 'OneRM Progression',
                data: oneRMData.map(item => item.weight),
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
            },
        ],
    };

    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>
                    <h5>{liftName}</h5>
                </Card.Title>
                <Badge bg="secondary">Goal: {goalValue} lbs</Badge>
                <ProgressBar now={progressPercentage} label={`${Math.round(progressPercentage)}%`} className="mt-3" />
                <Row className="mt-3">
                    <Col>
                        <Line data={chartData} options={{ responsive: true }} />
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default GoalProgressCard;
