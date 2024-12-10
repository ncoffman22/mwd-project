import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Card, Tabs, Tab } from 'react-bootstrap';
import WorkoutDayTab from './components/WorkoutDayTab/WorkoutDayTab';

const AddWorkoutChild = ({
    splits,
    selectedSplit,
    liftTypes,
    selectedLifts,
    onSplitSelect,
    onLiftSelect,
    onRemoveLift,
    onSubmit,
    workoutDates,
    onDateChange,
    user
}) => {
    const [showExerciseForm, setShowExerciseForm] = useState(false);
    const [selectedLiftType, setSelectedLiftType] = useState(null);
    const [activeTab, setActiveTab] = useState('day1');
    const [exerciseMode, setExerciseMode] = useState('manual');

    useEffect(() => {
        const defaultSplit = user.defaultSplit;
        if (defaultSplit && !selectedSplit) {
            onSplitSelect(defaultSplit.id);
        }
    }, [user, selectedSplit, onSplitSelect]);

    const handleLiftTypeSelect = (liftType) => {
        setSelectedLiftType(liftType);
        setShowExerciseForm(true);
    };

    const handleExerciseSubmit = (exerciseData) => {
        onLiftSelect(activeTab, exerciseData);
        setShowExerciseForm(false);
        setSelectedLiftType(null);
    };

    const handleAutoWorkoutGenerated = (exercises) => {
        exercises.forEach(exercise => {
            onLiftSelect(activeTab, exercise);
        });
        setExerciseMode('manual');
    };

    const handleExerciseModeChange = (mode) => {
        setExerciseMode(mode);
        setShowExerciseForm(false);
        setSelectedLiftType(null);
    };

    const workoutDayTabs = useMemo(() => {
        if (!selectedSplit) {
            return null;
        }

        return Array.from({ length: selectedSplit.get('days') || 0 }, (_, i) => {
            const dayNum = i + 1;
            const dayKey = `day${dayNum}`;
            const dayParts = selectedSplit.get(dayKey) || [];
            
            return (
                <Tab key={dayKey} eventKey={dayKey} title={`Day ${dayNum}`}>
                    <WorkoutDayTab 
                        dayNum={dayNum} 
                        dayKey={dayKey} 
                        dayParts={dayParts} 
                        workoutDates={workoutDates}
                        onDateChange={onDateChange}
                        exerciseMode={exerciseMode}
                        showExerciseForm={showExerciseForm}
                        selectedLiftType={selectedLiftType}
                        activeTab={activeTab}
                        selectedLifts={selectedLifts}
                        onLiftSelect={onLiftSelect}
                        onRemoveLift={onRemoveLift}
                        selectedSplit={selectedSplit}
                        liftTypes={liftTypes}
                        handleLiftTypeSelect={handleLiftTypeSelect}
                        handleAutoWorkoutGenerated={handleAutoWorkoutGenerated}
                        handleExerciseSubmit={handleExerciseSubmit}
                        setShowExerciseForm={setShowExerciseForm}
                        setSelectedLiftType={setSelectedLiftType}
                        setExerciseMode={handleExerciseModeChange}
                    />
                </Tab>
            );
        });
    }, [
        selectedSplit,
        workoutDates,
        onDateChange,
        exerciseMode,
        showExerciseForm,
        selectedLiftType,
        activeTab,
        selectedLifts,
        onLiftSelect,
        onRemoveLift,
        liftTypes,
        handleLiftTypeSelect,
        handleAutoWorkoutGenerated,
        handleExerciseSubmit
    ]);
    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Create New Workout Plan</h3>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={onSubmit}>
                    {/* Split Selection */}
                    <Form.Group className="mb-4">
                        <Form.Label><strong>Select Split</strong></Form.Label>
                        <Form.Select
                            value={selectedSplit?.id || ''}
                            onChange={(e) => onSplitSelect(e.target.value)}
                            required
                            className="mb-3"
                        >
                            <option value="">Choose a split...</option>
                            {splits.map((split) => (
                                <option 
                                    key={split.id} 
                                    value={split.id}
                                    selected={split.id === user.defaultSplit?.id}
                                >
                                    {split.get('name')}
                                    {split.id === user.defaultSplit?.id ? ' (Default)' : ''}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {selectedSplit && (
                        <>
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                                className="mb-4"
                            >
                                {workoutDayTabs}
                            </Tabs>

                            <div className="d-grid gap-2 mt-4">
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    size="lg"
                                    disabled={Object.keys(selectedLifts).length === 0}
                                >
                                    Create Workouts
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AddWorkoutChild;