import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';

const ProgressSection = ({ progress, isComplete, passedSets = 0, failedSets = 0 }) => {
    const totalAttempted = passedSets + failedSets;
    const successRate = totalAttempted > 0 ? Math.round((passedSets / totalAttempted) * 100) : 0;

    return (
        <Card className="mb-4">
            <Card.Body>
                <h5 className="mb-3">Workout Progress</h5>
                <ProgressBar
                    now={progress}
                    label={`${progress}%`}
                    variant={isComplete ? "success" : "primary"}
                    className="mb-2"
                />
                
                <div className="d-flex justify-content-between mt-3">
                    <div>
                        <small className="text-success d-block">
                            Passed Sets: {passedSets}
                        </small>
                        <small className="text-danger d-block">
                            Failed Sets: {failedSets}
                        </small>
                    </div>
                    <div className="text-end">
                        <small className="text-muted d-block">
                            Success Rate: {successRate}%
                        </small>
                        <small className="text-muted d-block">
                            {isComplete 
                                ? "All exercises completed!"
                                : `${progress}% of sets attempted`
                            }
                        </small>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProgressSection;