import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import GoalSearch from './GoalsSearch';

const AddGoalsChild = ({ formData, onGoalChange, onSubmit }) => {
    const [selectedLifts, setSelectedLifts] = useState({});
    const [activeTab, setActiveTab] = useState('search');

    if (formData.loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }
    // handleToggleLift function
    const handleToggleLift = (lift) => {
        setSelectedLifts(prev => {
            const newSelected = { ...prev };
            if (newSelected[lift.id]) {
                delete newSelected[lift.id];
                onGoalChange(lift.id, null);
            } else {
                newSelected[lift.id] = lift;
            }
            return newSelected;
        });
    };

    // handleGoToWeights function
    const handleGoToWeights = () => {
        if (Object.keys(selectedLifts).length > 0) {
            setActiveTab('weights');
        }
    };

    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Set Training Goals</h3>
            </Card.Header>
            <Card.Body>
                {formData.error && (
                    <Alert variant="danger" className="mb-4">
                        {formData.error}
                    </Alert>
                )}

                <div className="mb-4">
                    <Button 
                        type="button"
                        variant={activeTab === 'search' ? 'primary' : 'outline-primary'} 
                        onClick={() => setActiveTab('search')}
                        className="me-2"
                    >
                        Select Exercises
                    </Button>
                    <Button
                        type="button"
                        variant={activeTab === 'weights' ? 'primary' : 'outline-primary'}
                        onClick={handleGoToWeights}
                        disabled={Object.keys(selectedLifts).length === 0}
                    >
                        Set Weights ({Object.keys(selectedLifts).length})
                    </Button>
                </div>

                <Form onSubmit={(e) => {
                    e.preventDefault();
                    if (Object.keys(selectedLifts).length > 0 && 
                        Object.keys(formData.goals).length > 0) {
                        onSubmit(e);
                    }
                }}>
                    {activeTab === 'search' ? (
                        <GoalSearch
                            formData={formData}
                            selectedLifts={selectedLifts}
                            onToggleLift={handleToggleLift}
                        />
                    ) : (
                        <div>
                            <Row>
                                {Object.values(selectedLifts).map(lift => (
                                    <Col key={lift.id} md={6} lg={4} className="mb-3">
                                        <Card>
                                            <Card.Body>
                                                <div className="mb-2">
                                                    <strong>{lift.get('name')}</strong>
                                                    <div className="mt-1">
                                                        <Badge bg="secondary" className="me-2">
                                                            {lift.get('bodyPart')}
                                                        </Badge>
                                                        <Badge bg="info">
                                                            {lift.get('level')}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Form.Group>
                                                    <div className="d-flex align-items-center">
                                                        <Form.Control
                                                            type="number"
                                                            min="0"
                                                            step="5"
                                                            placeholder="Target weight"
                                                            value={formData.goals[lift.id] || ''}
                                                            onChange={(e) => onGoalChange(lift.id, e.target.value)}
                                                            className="me-2"
                                                        />
                                                        <span className="text-muted">lbs</span>
                                                        <Button 
                                                            variant="outline-danger" 
                                                            size="sm"
                                                            className="ms-2"
                                                            onClick={() => handleToggleLift(lift)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </Form.Group>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>

                            {Object.keys(selectedLifts).length === 0 && (
                                <Alert variant="info">
                                    No exercises selected. Go back to the search tab to select exercises.
                                </Alert>
                            )}
                        </div>
                    )}

                    <div className="d-grid gap-2 mt-4">
                        <Button 
                            type="submit" 
                            variant="primary" 
                            size="lg"
                            disabled={Object.keys(selectedLifts).length === 0 || 
                                    Object.keys(formData.goals).length === 0}
                        >
                            Save Goals
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AddGoalsChild;