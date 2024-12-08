import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Card, Tabs, Tab } from 'react-bootstrap';
import DayTab from './components/DayTab/DayTab';


const AddSplitChild = ({
    splitData,
    onSplitDataChange,
    onBodyPartChange,
    onSubmit,
    user
}) => {
    // start with day1 tab active
    const [activeTab, setActiveTab] = useState('day1');

    useEffect(() => {
        // set default split name if user has one
        const defaultSplit = user.get('defaultSplit');
        if (defaultSplit && !splitData.name) {
            onSplitDataChange('name', defaultSplit.get('name'));
        }
    }, [user, splitData.name, onSplitDataChange]);

    // handle form submission
    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    // memoize the day tabs to prevent re-rendering
    const dayTabs = useMemo(() => {
        if (!splitData.days) return null;
        return Array.from({ length: splitData.days }).map((_, dayIndex) => {
            const dayNum = dayIndex + 1;
            const dayKey = `day${dayNum}`;
            const selectedParts = splitData.bodyparts[dayKey];
            return (
                <Tab key={dayKey} eventKey={dayKey} title={`Day ${dayNum}`}>
                    <DayTab dayKey={dayKey} dayNum={dayNum} selectedParts={selectedParts} onBodyPartChange={onBodyPartChange} />
                </Tab>
            );
        })
    }, [splitData.days, splitData.bodyparts, onBodyPartChange]);
    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Create New Split Plan</h3>
            </Card.Header>
            <Card.Body>
                {/* Split form */}
                <Form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Split Name</strong></Form.Label>
                            <Form.Control
                                type="text"
                                value={splitData.name}
                                onChange={(e) => onSplitDataChange('name', e.target.value)}
                                placeholder="Enter split name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Description</strong></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={splitData.description}
                                onChange={(e) => onSplitDataChange('description', e.target.value)}
                                placeholder="Enter split description"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Number of Days</strong></Form.Label>
                            <Form.Select
                                value={splitData.days}
                                onChange={(e) => onSplitDataChange('days', parseInt(e.target.value))}
                                required
                            >
                                {/* this gives selection for number of days by mapping*/}
                                <option value="">Select number of days...</option>
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <option key={num} value={num}>{num} {num === 1 ? 'Day' : 'Days'}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Check
                                type="checkbox"
                                id="setAsDefault"
                                label="Set as default split"
                                checked={splitData.setAsDefault}
                                onChange={(e) => onSplitDataChange('setAsDefault', e.target.checked)}
                            />
                        </Form.Group>
                    </div>

                    {/* Tabs for each day */}
                    {splitData.days > 0 && (
                        <Tabs
                            activeKey={activeTab}
                            onSelect={(k) => setActiveTab(k)}
                            className="mb-4"
                        >
                            {dayTabs}
                        </Tabs>
                    )}
                        
                    {/* Submit button */}
                    <div className="d-grid gap-2 mt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={!splitData.name || !splitData.days || !Object.values(splitData.bodyparts).some(day => day.length > 0)}
                        >
                            Create Split
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};
export default AddSplitChild;