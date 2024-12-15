import React, { useState, useMemo, useEffect } from 'react';
import { Form, Card, ListGroup, Badge, Row, Col, Button } from 'react-bootstrap';
import Fuse from 'fuse.js';
import debounce from 'lodash/debounce';

const LiftSearch = ({ formData, dayKey, onLiftSelect, statistics }) => {
    const [searchState, setSearchState] = useState({
        term: '',
        results: [],
        debouncedTerm: '',
        selected: false,
        lift: {
            liftType: null,
            sets: 3,
            reps: 10,
            weight: 135
        }
    });

    // Fuse search instance — memoized because we just want to create it once per formData.liftTypes change
    const fuse = useMemo(() => {
        if (!formData.liftTypes) return null;
        const dayParts = formData.selectedSplit.get(dayKey) || [];

        // get lifts by body part
        const eligibleLifts = formData.liftTypes.filter(liftType => dayParts.some(part => liftType.get('bodyPart').toLowerCase() === part.toLowerCase()));

        // map to fuse search object
        const lifts = eligibleLifts.map(liftType => ({
            id: liftType.id,
            name: liftType.get('name'),
            bodyPart: liftType.get('bodyPart'),
            equipment: liftType.get('equipment'),
            type: liftType.get('type'),
            level: liftType.get('level'),
            originalLift: liftType
        }));

        // return fuse instance
        return new Fuse(lifts, {
            keys: [
                { name: 'name', weight: 3 },
                { name: 'bodyPart', weight: 1 },
                { name: 'equipment', weight: 1 },
                { name: 'type', weight: 1 }
            ],
            threshold: 0.4,             // 0.6 is default
            distance: 100,              // 100 is default
            minMatchCharLength: 2       // 1 is default
        });
    }, [formData.liftTypes, formData.selectedSplit, dayKey]);

    // debounced search function — memoized because we want to keep the same instance
    const debouncedSearch = useMemo(() => 
        debounce((term, fuseInstance) => {
            if (!fuseInstance || !term.trim()) {
                setSearchState(prev => ({...prev, results: []}));
                return;
            }
            const searchResults = fuseInstance.search(term).map(result => result.item.originalLift);
            setSearchState(prev => ({...prev, results: searchResults}));
        }, 300), []);

    // cleanup debounced search on unmount
    useEffect(() => {
        return () => debouncedSearch.cancel();
    }, [debouncedSearch]);


    const handleSearchChange = (e) => {
        const newTerm = e.target.value;
        setSearchState(prev => ({...prev, term: newTerm}));
        debouncedSearch(newTerm, fuse);
    };
    
    const handleLiftSelect = (liftType) => {
        setSearchState(prev => ({
            ...prev,
            selected: true,
            lift: {
                liftType,
                sets: 3,
                reps: 10,
                weight: 0
            }
        }));
    };

    const handleLiftChange = (e) => {
        const { name, value } = e.target;
        setSearchState(prev => ({
            ...prev,
            lift: {
                ...prev.lift,
                [name]: value
            }
        }));
    };

    return (
        <Form.Group className="mb-4 align-items-center">
            <Form.Label>Search Exercises</Form.Label>
            <Form.Control
                type="text"
                placeholder="Search by name, body part, or equipment..."
                value={searchState.term}
                onChange={handleSearchChange}
            />
            {/* Show search results */}
            {searchState.term && (
                <Card className="mt-2">
                    <ListGroup>
                        {searchState.results.length > 0 ? (searchState.results.map((liftType) => (
                            <ListGroup.Item
                                key={liftType.id}
                                action
                                onClick={() => {
                                    handleLiftSelect(liftType);
                                    setSearchState(prev => ({...prev, term: '', results: []}));
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{liftType.get('name')}</strong>
                                        <br />
                                        <Badge bg="info" pill className="me-2">{liftType.get('type')}</Badge>
                                        <Badge bg="secondary" pill className="me-2">{liftType.get('equipment')}</Badge>
                                        <Badge bg="success" pill >{liftType.get('bodyPart')}</Badge>

                                    </div>
                                    <Badge className="secondary">{liftType.get('level')}</Badge>
                                </div>
                            </ListGroup.Item>
                        ))
                        ) : (
                            <ListGroup.Item>No exercises found</ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>
            )}
            
            {/* Show selected lift form */}
            {(searchState.selected && (
                <div className="p-3 border rounded bg-light">
                    <Row>
                        <Col md={searchState.lift.liftType.get('equipment') === 'Body Only' ? 6 : 4}>
                            <Form.Group className="mb-2">
                                <Form.Label>Sets</Form.Label>
                                <Form.Control type="number" name="sets" value={searchState.lift.sets} onChange={handleLiftChange} required min="1"/>
                            </Form.Group>
                        </Col>
                        <Col  md={searchState.lift.liftType.get('equipment') === 'Body Only' ? 6 : 4}>
                            <Form.Group className="mb-2">
                                <Form.Label>Reps</Form.Label>
                                <Form.Control type="number" name="reps" value={searchState.lift.reps} onChange={handleLiftChange} required min="1"/>
                            </Form.Group>
                        </Col>
                        {searchState.lift.liftType.get('equipment') !== 'Body Only' && (
                            <Col md={4}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Weight (lbs)</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        name="weight" 
                                        value={searchState.lift.weight} 
                                        onChange={handleLiftChange} 
                                        required min="0"
                                    />
                                </Form.Group>
                            </Col>
                        )}
                    </Row>
                    <div className="mt-2 d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={() => {
                            setSearchState(prev => ({...prev, selected: false}));
                            }}>Cancel</Button>
                        <Button variant="primary" 
                                onClick={() => {
                                    onLiftSelect(searchState.lift);
                                    setSearchState(prev => ({...prev, selected: false}));
                                }}
                        >Add to Workout</Button>
                    </div>
                </div>
            ))}
        </Form.Group>
    );
};

export default LiftSearch;