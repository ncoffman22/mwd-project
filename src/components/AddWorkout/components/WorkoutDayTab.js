import React, { useState , useEffect } from 'react';
import { Badge, Button, ButtonGroup, Card, Form, ListGroup } from 'react-bootstrap';
import AutoWorkoutForm from './AutoWorkoutForm';
import LiftSearch from './LiftSearch';
import { getCachedUserStatistics } from '../../../services/cacheService';

const WorkoutDayTab = ({ dayNum, dayKey, formData, onFormUpdate, user }) => {
    const [mode, setMode] = useState('search');
    const [statistics, setStatistics] = useState(null);
    useEffect(() => {
        const fetchStatistics = async () => {
            if (!user) {
                return;
            }

            try {
                const results = await getCachedUserStatistics(user.id);
                setStatistics(results);
            } catch (err) {
                console.error('Error fetching statistics:', err);
            } 
        };
        fetchStatistics();
    }, [user]);
    
    // created a switch statement to handle the different types of updates
    const handleUpdate = (type, item) => {
        switch(type) {
            case 'date':
                onFormUpdate('workoutDates', {
                    ...formData.workoutDates,
                    [dayKey]: item
                });
                break;
            case 'addLift':
                onFormUpdate('workouts', {
                    ...formData.workouts,
                    [dayKey]: [
                        ...(formData.workouts[dayKey] || []),
                        item
                    ]
                });
                break;
            
            case 'removeLift':
                const newWorkouts = {...formData.workouts};
                newWorkouts[dayKey] = newWorkouts[dayKey].filter(lift => lift !== item);
                if (newWorkouts[dayKey].length === 0) {
                    delete newWorkouts[dayKey];
                }
                onFormUpdate('workouts', newWorkouts);
                break;
            case 'autoGenerate':
                const newLifts = {
                    ...formData.workouts,
                    [dayKey]: [...(formData.workouts[dayKey] || []), ...item]
                };
                onFormUpdate('workouts', newLifts);
                break;
            default:
                break;
        }
    };
    return (
        <Card className="mt-3 border-0">
            <Card.Body>
                <div className="mb-4">
                    <h5>Body Parts for Day {dayNum}</h5>
                    <div className="mb-3">
                        {formData.selectedSplit.get(dayKey).map((part, index) => (
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
                <Form.Group className='mb-4'>
                    <Form.Label><strong>Workout Date</strong></Form.Label>
                    <Form.Control
                        type='date'
                        value={formData.workoutDates[dayKey]?.split('T')[0] || ''}
                        onChange={(e) => handleUpdate('date', e.target.value)}
                        required
                    />
                </Form.Group>
                <Card className="mb-4">
                    <Card.Header className="light">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Add Exercises</h5>
                            <ButtonGroup size="sm">
                                <Button
                                    variant={mode === 'search' ? 'primary' : 'outline-primary'}
                                    onClick={() => setMode('search')}
                                >
                                    Manual Search
                                </Button>
                                <Button
                                    variant={mode === 'auto' ? 'primary' : 'outline-primary'}
                                    onClick={() => setMode('auto')}
                                >
                                    Auto Generate
                                </Button>
                            </ButtonGroup>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="p-3">
                            {mode === 'search' && (
                                <LiftSearch
                                    formData={formData}
                                    dayKey={dayKey}
                                    onLiftSelect={(lift) => handleUpdate('addLift', lift)}
                                    statistics={statistics}
                                />
                            )}
                            {mode === 'auto' && (
                                <AutoWorkoutForm
                                    formData={formData}
                                    dayKey={dayKey}
                                    onWorkoutsGenerated={(lifts) => handleUpdate('autoGenerate', lifts)}
                                    user={user}
                                />
                            )}
                        </div>
                    </Card.Body>
                </Card>
                {formData.workouts[dayKey]?.length > 0 && (
                    <div className="mt-4">
                        <ListGroup>
                            {formData.workouts[dayKey].map((lift, index) => (
                                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className="fw-bold">{lift.liftType.get('name')}</div>
                                        <small className="text-muted">
                                            {lift.sets} sets x {lift.reps} reps @ {lift.weight} lbs
                                        </small>
                                        <div>
                                            <Badge bg="info" className="me-2">{lift.liftType.get('bodyPart')}</Badge>
                                            <Badge bg="secondary">{lift.liftType.get('equipment')}</Badge>
                                        </div>
                                    </div>                                    
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleUpdate('removeLift', lift)}
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
    )
};
export default WorkoutDayTab;