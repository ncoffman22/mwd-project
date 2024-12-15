import React, { useState } from 'react';
import { Form, Button, Card, Tabs, Tab, Spinner } from 'react-bootstrap';
import WorkoutDayTab from './components/WorkoutDayTab';

const AddWorkoutChild = ({ formData, onFormUpdate, onSubmit, onSplitSelect, user }) => {
    const [activeTab, setActiveTab] = useState('day1');

    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Create New Workout Plan</h3>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-4">
                        <Form.Label>Select Workout Split</Form.Label>
                        <Form.Select
                            value={formData.selectedSplit?.id || ''}
                            onChange={(e) => onSplitSelect(e.target.value)}
                            required
                            className="mb-3"
                        >
                            <option value="">Select a split...</option>
                            {formData.splits.map((split) => (
                                <option key={split.id} value={split.id}>
                                    {split.get('name')}
                                    {split.id === user.defaulSplit?.id ? ' (Default)' : ''}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    {/* Only show tabs if a split is selected */}
                    {formData.selectedSplit && (
                        <>
                            <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
                                {Array.from({ length: formData.days || 0 }).map((_, index) => {
                                    const dayNum = index + 1;
                                    const dayKey = `day${dayNum}`;
                                    return (
                                        <Tab key={dayKey} eventKey={dayKey} title={`Day ${dayNum}`}>
                                            <WorkoutDayTab
                                                dayNum={dayNum}
                                                dayKey={dayKey}
                                                formData={formData}
                                                onFormUpdate={onFormUpdate}
                                                user={user}
                                            />
                                        </Tab>
                                    );
                                })}
                            </Tabs>
                            <div className="d-flex justify-content-between">
                                <Button type="submit" variant="primary" size="lg">
                                    {formData.submitLoading ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        'Create Workout Plan'
                                    )}
                                </Button>
                                {/* Sjpw */}
                            </div>
                        </>
                    )}
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AddWorkoutChild;