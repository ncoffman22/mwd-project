import React, { useState } from 'react';
import { Card, Button, ProgressBar, ButtonGroup, Form } from 'react-bootstrap';
import { CheckCircle, XCircle } from 'lucide-react';

const LiftCard = ({ lift, progress, onSetComplete, onWeightUpdate, editable }) => {
    const [weights, setWeights] = useState(
        Array(lift.sets).fill(lift.weight)
    );

    // Function to handle weight change
    const handleWeightChange = (setIndex, newWeight) => {
        const updatedWeights = [...weights];
        updatedWeights[setIndex] = Number(newWeight);
        setWeights(updatedWeights);
        onWeightUpdate(lift.id, setIndex, Number(newWeight));
    };

    // Function to calculate progress
    const calculateProgress = () => {
        if (!progress) return 0;
        const attemptedSets = (progress.passedSets?.length || 0) + (progress.failedSets?.length || 0);
        return Math.round((attemptedSets / lift.sets) * 100);
    };

    // Function to get set status
    const getSetStatus = (setIndex) => {
        if (progress?.passedSets?.includes(setIndex)) return 'passed';
        if (progress?.failedSets?.includes(setIndex)) return 'failed';
        return null;
    };

    return (
        <Card className="mb-4">
            <Card.Header>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h4 className="mb-0">{lift.name}</h4>
                        <small className="text-muted">
                            Target: {lift.sets} sets × {lift.reps} reps
                        </small>
                    </div>
                </div>
                <ProgressBar 
                    now={calculateProgress()} 
                    label={`${calculateProgress()}%`}
                    className="mt-2"
                />
            </Card.Header>
            <Card.Body>
                {/* Warm-up suggestion */}
                <div className="bg-light p-3 rounded mb-4">
                    <strong className="d-block mb-2">Warm-up Sets</strong>
                    <div className="d-flex justify-content-around">
                        {[50, 70, 90].map((percentage) => (
                            <div key={percentage} className="text-center">
                                <div className="fw-bold">
                                    {Math.round((lift.weight * (percentage / 100))/5)*5} lbs
                                </div>
                                <small className="text-muted">{percentage}%</small>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Working sets */}
                {Array.from({ length: lift.sets }).map((_, idx) => (
                    <div key={idx} className="bg-light p-3 rounded mb-3">
                        <div className="d-flex align-items-center">
                            <strong className="me-3">Set {idx + 1}:</strong>
                            {/* I tried making only one weight editable but I ran into trouble so I left it as is */}
                            {editable ? (
                                <Form.Control
                                    type="number"
                                    value={weights[idx]}
                                    onChange={(e) => handleWeightChange(idx, e.target.value)}
                                    className="w-auto me-3"
                                    step={5}
                                />
                            ) : (
                                <span className="me-1">{weights[idx]} lbs.</span>
                            )}
                            <span className="me-2">x {lift.reps} reps</span>
                            <ButtonGroup className="ms-auto">
                                <Button
                                    variant={getSetStatus(idx) === 'passed' ? "success" : "outline-success"}
                                    onClick={() => onSetComplete(lift.id, idx, 'passed')}
                                >
                                    <CheckCircle size={16} className="me-1" />
                                    Pass
                                </Button>
                                <Button
                                    variant={getSetStatus(idx) === 'failed' ? "danger" : "outline-danger"}
                                    onClick={() => onSetComplete(lift.id, idx, 'failed')}
                                >
                                    <XCircle size={16} className="me-1" />
                                    Fail
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                ))}
            </Card.Body>
        </Card>
    );
};

export default LiftCard;