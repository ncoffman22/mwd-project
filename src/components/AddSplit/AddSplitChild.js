import React, { useState } from 'react';
import { Form, Button, Card, Tabs, Tab, Badge, ListGroup } from 'react-bootstrap';

const BODY_PARTS = [
    'Abdominals', 'Adductors', 'Abductors', 'Biceps', 'Calves', 'Chest',
    'Forearms', 'Glutes', 'Hamstrings', 'Lats', 'Lower Back', 'Middle Back',
    'Traps', 'Neck', 'Quadriceps', 'Shoulders', 'Triceps'
];

const AddSplitChild = ({ formData, onBodyPartChange, onChange, onSubmit }) => {
    // start with day1 tab active
    const [activeTab, setActiveTab] = useState('1');
    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Create New Split Plan</h3>
            </Card.Header>
            <Card.Body>
                {/* Split form */}
                <Form onSubmit={onSubmit}>
                    <div className="mb-4">

                        {/* Split name */}
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Split Name</strong></Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => onChange('name', e.target.value)}
                                placeholder="Enter split name"
                                required
                            />
                        </Form.Group>
                        {/* Split description */}
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Description</strong></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={formData.description}
                                onChange={(e) => onChange('description', e.target.value)}
                                placeholder="Enter split description"
                            />
                        </Form.Group>
                        {/* Split days */}
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Number of Days</strong></Form.Label>
                            <Form.Select
                                value={formData.days}
                                onChange={(e) => onChange('days', parseInt(e.target.value))}
                                required
                            >
                                {/* this gives selection for number of days by mapping*/}
                                <option value="">Select number of days...</option>
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <option key={num} value={num}>{num} {num === 1 ? 'Day' : 'Days'}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        {/* Set as default split */}
                        <Form.Group className="mb-4">
                            <Form.Check
                                type="checkbox"
                                id="setAsDefault"
                                label="Set as default split"
                                checked={formData.setAsDefault}
                                onChange={(e) => onChange('setAsDefault', e.target.checked)}
                            />
                        </Form.Group>
                    </div>

                    {/* Day tabs */}
                    {formData.days && (
                        <Tabs activeKey={activeTab} onSelect={(n) => setActiveTab(n)} className="mb-4">
                            {[...Array(formData.days)].map((_, index) => {
                                const day = index + 1;
                                return (
                                    <Tab key={day} eventKey={day.toString()} title={`Day ${day}`}>
                                        <Card className="mt-3 border-0">
                                            <Card.Body>
                                                <h5 className="mb-3">Select Body Parts for Day {day}</h5>
                                                <div className="d-flex flex-wrap gap-2 mb-4">
                                                    {BODY_PARTS.map(part => (
                                                        <Badge
                                                            key={part}
                                                            bg={formData.bodyParts[day]?.includes(part) ? "primary" : "secondary"}
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => onBodyPartChange(day, part)}
                                                            className="p-2"
                                                        >
                                                            {part}
                                                        </Badge>
                                                    ))}
                                                </div>
                                
                                                {formData.bodyParts.length > 0 && (
                                                    <div className="mt-4">
                                                        <h5>Selected Body Parts</h5>
                                                        <ListGroup>
                                                            {formData.bodyParts.map((part, index) => (
                                                                <ListGroup.Item
                                                                    key={index}
                                                                    className="d-flex justify-content-between align-items-center"
                                                                >
                                                                    <span>{part}</span>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        onClick={() => onBodyPartChange(day, part)}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </ListGroup.Item>
                                                            ))}
                                                        </ListGroup>
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Tab>
                                );
                            })}
                        </Tabs>
                    )}
                        
                    {/* Submit button */}
                    <div className="d-grid">
                        <Button variant="primary" type="submit" size="lg" disabled={!formData.name || !formData.days || !Object.values(formData.bodyParts).some(parts => parts.length > 0)}>
                            Create Split
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};
export default AddSplitChild;