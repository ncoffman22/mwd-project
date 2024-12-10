import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { CheckCircle, XCircle, Weight } from 'lucide-react';

const SummarySection = ({ workout }) => {
    const calculateStats = () => {
        const stats = {
            totalVolume: 0,
            passedSets: 0,
            failedSets: 0,
            totalSets: 0,
            successRate: 0,
            averageWeight: 0,
            weightPerExercise: {}
        };

        if (!workout || !workout.lifts) return stats;

        workout.lifts.forEach(exercise => {
            // Get total sets for this exercise
            stats.totalSets += exercise.sets;

            // Count passed and failed sets
            stats.passedSets += exercise.passedSets?.length || 0;
            stats.failedSets += exercise.failedSets?.length || 0;

            // Calculate volume for this exercise
            const exerciseVolume = exercise.weight * exercise.reps * exercise.sets;
            stats.totalVolume += exerciseVolume;

            // Track weight per exercise
            stats.weightPerExercise[exercise.name] = exercise.weight;
        });

        // Calculate success rate
        const attemptedSets = stats.passedSets + stats.failedSets;
        stats.successRate = attemptedSets > 0 
            ? Math.round((stats.passedSets / attemptedSets) * 100)
            : 0;

        // Calculate average weight across all exercises
        const exerciseCount = Object.keys(stats.weightPerExercise).length;
        stats.averageWeight = exerciseCount > 0
            ? Math.round(Object.values(stats.weightPerExercise).reduce((a, b) => a + b, 0) / exerciseCount)
            : 0;

        return stats;
    };

    const stats = calculateStats();

    return (
        <Card className="mb-4">
            <Card.Body>
                <h5 className="mb-3">Workout Summary</h5>
                <Row>
                    <Col md={3} className="text-center mb-3 mb-md-0">
                        <div className="text-muted">
                            <Weight className="mb-1" size={20} />
                            <div>Total Volume</div>
                        </div>
                        <h4>{stats.totalVolume.toLocaleString()} lbs</h4>
                    </Col>
                    <Col md={3} className="text-center mb-3 mb-md-0">
                        <div className="text-muted">Success Rate</div>
                        <h4>
                            {stats.successRate}%
                            <small className="text-muted d-block">
                                of attempted sets
                            </small>
                        </h4>
                    </Col>
                    <Col md={3} className="text-center mb-3 mb-md-0">
                        <div className="text-muted">
                            <CheckCircle className="mb-1" size={20} />
                            <div>Passed Sets</div>
                        </div>
                        <h4 className="text-success">
                            {stats.passedSets}
                            <small className="text-muted d-block">
                                of {stats.totalSets} total
                            </small>
                        </h4>
                    </Col>
                    <Col md={3} className="text-center">
                        <div className="text-muted">
                            <XCircle className="mb-1" size={20} />
                            <div>Failed Sets</div>
                        </div>
                        <h4 className="text-danger">
                            {stats.failedSets}
                            <small className="text-muted d-block">
                                of {stats.totalSets} total
                            </small>
                        </h4>
                    </Col>
                </Row>

                <hr className="my-4" />

                <Row>
                    <Col md={6}>
                        <div className="text-muted mb-2">Average Weight per Exercise</div>
                        <div className="small">
                            {Object.entries(stats.weightPerExercise).map(([exercise, weight]) => (
                                <div key={exercise} className="d-flex justify-content-between mb-1">
                                    <span>{exercise}:</span>
                                    <strong>{weight} lbs</strong>
                                </div>
                            ))}
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="text-muted mb-2">Performance Details</div>
                        <div className="small">
                            <div className="d-flex justify-content-between mb-1">
                                <span>Average Weight:</span>
                                <strong>{stats.averageWeight} lbs</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-1">
                                <span>Completion Rate:</span>
                                <strong>
                                    {Math.round(((stats.passedSets + stats.failedSets) / stats.totalSets) * 100)}%
                                </strong>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default SummarySection;