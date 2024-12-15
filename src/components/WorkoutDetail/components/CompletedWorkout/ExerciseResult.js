import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { CheckCircle, XCircle } from 'lucide-react';

const ExerciseResult = ({ lift }) => {

    const getSetStatus = (setIndex) => {
        if (lift.passedSets?.includes(setIndex)) return 'passed';
        if (lift.failedSets?.includes(setIndex)) return 'failed';
        return null;
    };

    return (
        <Card className="mb-4">
            <Card.Header>
                <h4 className="mb-0">{lift.name}</h4>
                <small className="text-muted">
                    {lift.sets} sets × {lift.reps} reps
                </small>
            </Card.Header>
            <Card.Body>
                <div>
                    <Table className="table">
                        <thead>
                            <tr>
                                <th>Set</th>
                                <th>Weight</th>
                                <th>Reps</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: lift.sets }).map((_, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{lift.weight} lbs</td>
                                    <td>{lift.reps}</td>
                                    <td>
                                        <span className={getSetStatus(idx) === 'passed' ? "text-success" : "text-danger"}>
                                            {getSetStatus(idx) === 'passed' ? (
                                                <>
                                                    <CheckCircle size={16} className="me-1" />
                                                    Passed
                                                </>
                                            ) : getSetStatus(idx) === 'failed' ? (
                                                <>
                                                    <XCircle size={16} className="me-1" />
                                                    Failed
                                                </>
                                            ) : (
                                                'Not Recorded'
                                            )}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ExerciseResult;