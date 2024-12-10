import React from 'react';
import { Badge, Button, ButtonGroup, Card, Form, ListGroup } from 'react-bootstrap';
import AutoWorkoutForm from '../AutoWorkoutForm/AutoWorkoutForm';
import ExerciseForm from '../ExerciseForm/ExerciseForm';
import ExerciseSearch from '../ExerciseSearch/ExerciseSearch';

const WorkoutDayTab = ({
    dayNum,
    dayKey,
    dayParts,
    workoutDates,
    onDateChange,
    exerciseMode,
    showExerciseForm,
    selectedLiftType,
    activeTab,
    selectedLifts,
    onLiftSelect,
    onRemoveLift,
    selectedSplit,
    liftTypes,
    handleLiftTypeSelect,
    handleAutoWorkoutGenerated,
    handleExerciseSubmit,
    setShowExerciseForm,
    setSelectedLiftType,
    setExerciseMode
}) => {
    return (
        <Card className="mt-3 border-0">
            <Card.Body>
                {/* Body Parts Section */}
                <div className="mb-4">
                    <h5>Body Parts for Day {dayNum}</h5>
                    <div className="mb-3">
                        {dayParts.map((part, index) => (
                            <Badge 
                                key={index} 
                                bg="secondary" 
                                className="me-2 mb-2"
                            >
                                {part}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Date Selection */}
                <Form.Group className="mb-4">
                    <Form.Label><strong>Workout Date</strong></Form.Label>
                    <Form.Control
                        type="date"
                        value={workoutDates[dayKey]?.split('T')[0] || ''}
                        onChange={(e) => onDateChange(dayKey, e.target.value)}
                        required
                    />
                </Form.Group>

                {/* Exercise Mode Selection */}
                <div className="mb-4">
                    <h5>Add Exercises</h5>
                    <ButtonGroup className="w-100 mb-3">
                        <Button
                            variant={exerciseMode === 'manual' ? 'primary' : 'outline-primary'}
                            onClick={() => setExerciseMode('manual')}
                        >
                            Manual Selection
                        </Button>
                        <Button
                            variant={exerciseMode === 'ai' ? 'primary' : 'outline-primary'}
                            onClick={() => setExerciseMode('ai')}
                        >
                            AI Generation
                        </Button>
                    </ButtonGroup>

                    {exerciseMode === 'manual' && !showExerciseForm && (
                        <ExerciseSearch
                            selectedDay={dayKey}
                            selectedSplit={selectedSplit}
                            liftTypes={liftTypes}
                            onLiftSelect={handleLiftTypeSelect}
                        />
                    )}

                    {exerciseMode === 'ai' && (
                        <AutoWorkoutForm
                            selectedSplit={selectedSplit}
                            activeDay={dayKey}
                            onWorkoutsGenerated={handleAutoWorkoutGenerated}
                            dayParts={dayParts}
                        />
                    )}

                    {showExerciseForm && selectedLiftType && activeTab === dayKey && (
                        <Card className="mb-4 bg-light">
                            <Card.Body>
                                <ExerciseForm
                                    liftType={selectedLiftType}
                                    onSubmit={handleExerciseSubmit}
                                    onCancel={() => {
                                        setShowExerciseForm(false);
                                        setSelectedLiftType(null);
                                    }}
                                />
                            </Card.Body>
                        </Card>
                    )}
                </div>

                {/* Selected Exercises List */}
                {selectedLifts[dayKey]?.length > 0 && (
                    <div className="mt-4">
                        <h5>Selected Exercises</h5>
                        <ListGroup>
                            {selectedLifts[dayKey].map((lift, index) => (
                                <ListGroup.Item 
                                    key={index}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <div>
                                        <div className="fw-bold">
                                            {lift.liftType.get('name')}
                                        </div>
                                        <small className="text-muted">
                                            {lift.sets} sets × {lift.reps} reps
                                            {lift.liftType.get('type')?.toLowerCase() !== 'bodyweight' && 
                                                ` @ ${lift.weight} lbs`
                                            }
                                        </small>
                                        <div>
                                            <Badge bg="info" className="me-2">
                                                {lift.liftType.get('bodyPart')}
                                            </Badge>
                                            <Badge bg="secondary">
                                                {lift.liftType.get('equipment')}
                                            </Badge>
                                            <Badge bg="success" className="ms-2">
                                                {lift.liftType.get('type')}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => onRemoveLift(dayKey, index)}
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
    );
};

export default WorkoutDayTab;