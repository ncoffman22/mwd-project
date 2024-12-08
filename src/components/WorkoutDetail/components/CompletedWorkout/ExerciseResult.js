import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { CheckCircle, XCircle } from 'lucide-react';

const ExerciseResult = ({ exercise, editable, onSave }) => {
    const [editedExercise, setEditedExercise] = useState(exercise);

    const handleChange = (setIndex, field, value) => {
        const updatedExercise = { ...editedExercise };
        
        if (field === 'status') {
            // Update pass/fail sets
            const passedSets = new Set(updatedExercise.passedSets || []);
            const failedSets = new Set(updatedExercise.failedSets || []);
            
            if (value === 'passed') {
                passedSets.add(setIndex);
                failedSets.delete(setIndex);
            } else if (value === 'failed') {
                failedSets.add(setIndex);
                passedSets.delete(setIndex);
            }
            
            updatedExercise.passedSets = Array.from(passedSets);
            updatedExercise.failedSets = Array.from(failedSets);
        } else {
            // Handle other field updates (weight, notes)
            if (!updatedExercise.setDetails) {
                updatedExercise.setDetails = {};
            }
            if (!updatedExercise.setDetails[setIndex]) {
                updatedExercise.setDetails[setIndex] = {};
            }
            updatedExercise.setDetails[setIndex][field] = value;
        }
        
        setEditedExercise(updatedExercise);
        onSave(updatedExercise);
    };

    const getSetStatus = (setIndex) => {
        if (editedExercise.passedSets?.includes(setIndex)) return 'passed';
        if (editedExercise.failedSets?.includes(setIndex)) return 'failed';
        return null;
    };

    return (
        <Card className="mb-4">
            <Card.Header>
                <h4 className="mb-0">{exercise.name}</h4>
                <small className="text-muted">
                    {exercise.sets} sets × {exercise.reps} reps
                </small>
            </Card.Header>
            <Card.Body>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Set</th>
                                <th>Weight</th>
                                <th>Status</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: exercise.sets }).map((_, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        {editable ? (
                                            <Form.Control
                                                type="number"
                                                value={editedExercise.setDetails?.[idx]?.weight || exercise.weight}
                                                onChange={(e) => handleChange(idx, 'weight', e.target.value)}
                                                className="w-75"
                                            />
                                        ) : (
                                            `${editedExercise.setDetails?.[idx]?.weight || exercise.weight} lbs`
                                        )}
                                    </td>
                                    <td>
                                        {editable ? (
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant={getSetStatus(idx) === 'passed' ? "success" : "outline-success"}
                                                    size="sm"
                                                    onClick={() => handleChange(idx, 'status', 'passed')}
                                                >
                                                    <CheckCircle size={16} className="me-1" />
                                                    Pass
                                                </Button>
                                                <Button
                                                    variant={getSetStatus(idx) === 'failed' ? "danger" : "outline-danger"}
                                                    size="sm"
                                                    onClick={() => handleChange(idx, 'status', 'failed')}
                                                >
                                                    <XCircle size={16} className="me-1" />
                                                    Fail
                                                </Button>
                                            </div>
                                        ) : (
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
                                        )}
                                    </td>
                                    <td>
                                        {editable ? (
                                            <Form.Control
                                                type="text"
                                                value={editedExercise.setDetails?.[idx]?.notes || ''}
                                                onChange={(e) => handleChange(idx, 'notes', e.target.value)}
                                                placeholder="Add notes..."
                                            />
                                        ) : (
                                            editedExercise.setDetails?.[idx]?.notes || '-'
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ExerciseResult;