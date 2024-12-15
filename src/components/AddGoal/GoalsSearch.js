import React, { useState, useMemo,  useEffect } from 'react';
import { Form, Card, ListGroup, InputGroup, Button, Badge } from 'react-bootstrap';
import Fuse from 'fuse.js';
import debounce from 'lodash/debounce';

const GoalSearch = ({ formData, selectedLifts, onToggleLift }) => {
    const [searchState, setSearchState] = useState({
        term: '',
        showResults: false,
        results: []
    });


    // Create memoized Fuse instance
    const fuse = useMemo(() => {
        if (!formData.liftTypes) return null;
        
        const searchableLifts = formData.liftTypes.map(liftType => ({
            id: liftType.id,
            name: liftType.get('name'),
            bodyPart: liftType.get('bodyPart'),
            equipment: liftType.get('equipment'),
            type: liftType.get('type'),
            level: liftType.get('level'),
            originalLift: liftType
        })).filter(lift => lift.type.toLowerCase() !== 'bodyweight');

        return new Fuse(searchableLifts, {
            keys: [
                { name: 'name', weight: 3 },
                { name: 'bodyPart', weight: 1.5 },
                { name: 'equipment', weight: 1 },
                { name: 'type', weight: 1 }
            ],
            threshold: 0.4,
            distance: 100,
            minMatchCharLength: 2
        });
    }, [formData.liftTypes]);

    // Create memoized debounced search function
    const debouncedSearch = useMemo(() => 
        debounce((term, fuseInstance) => {
            if (!fuseInstance || !term.trim()) {
                setSearchState(prev => ({...prev, results: []}));
                return;
            }
            
            const searchResults = fuseInstance.search(term)
                .map(result => result.item.originalLift)
                .sort((a, b) => a.get('bodyPart').localeCompare(b.get('bodyPart')));
            
            setSearchState(prev => ({...prev, results: searchResults}));
        }, 300),
    []);

    // Cleanup debounced search on unmount
    useEffect(() => {
        return () => debouncedSearch.cancel();
    }, [debouncedSearch]);

    // hanlde search change
    const handleSearchChange = (e) => {
        const newTerm = e.target.value;
        setSearchState(prev => ({
            ...prev,
            term: newTerm,
            showResults: true
        }));
        debouncedSearch(newTerm, fuse);
    };

    return (
        <div className="mb-4">
            <Form.Label>Search for exercises to set goals</Form.Label>
            <InputGroup>
                <Form.Control
                    type="text"
                    placeholder="Search by name, body part, or equipment..."
                    value={searchState.term}
                    onChange={handleSearchChange}
                    autoComplete="off"
                />
                {searchState.term && (
                    <Button 
                        variant="outline-secondary"
                        onClick={() => setSearchState(prev => ({ 
                            ...prev, 
                            term: '', 
                            showResults: false, 
                            results: [] 
                        }))}
                    >
                        Clear
                    </Button>
                )}
            </InputGroup>
            
            {searchState.showResults && searchState.term && (
                <Card className="mt-2">
                    <ListGroup>
                        {searchState.results.length > 0 ? (
                            searchState.results.map((lift) => (
                                <ListGroup.Item
                                    key={lift.id}
                                    action
                                    variant={selectedLifts[lift.id] ? "primary" : undefined}
                                    onClick={(e) =>{ 
                                        e.preventDefault(); // added these to prevent submitting the form
                                        e.stopPropagation();
                                        onToggleLift(lift);}}
                                    className="hover-highlight"
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{lift.get('name')}</strong>
                                            <br />
                                            <small className="text-muted">
                                                {lift.get('bodyPart')} - {lift.get('equipment')}
                                            </small>
                                        </div>
                                        <div className="text-end">
                                            <Badge bg="secondary">
                                                {lift.get('level')}
                                            </Badge>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <ListGroup.Item>No exercises found</ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>
            )}
            {Object.keys(selectedLifts).length > 0 && (
                <div className="mt-3">
                    <Badge bg="primary" className="me-2">
                        {Object.keys(selectedLifts).length} exercises selected
                    </Badge>
                </div>
            )}
        </div>
    );
};

export default GoalSearch;