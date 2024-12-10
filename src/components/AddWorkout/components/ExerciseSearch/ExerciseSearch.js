import React, { useState, useCallback, useEffect } from 'react';
import { Form, Card, ListGroup } from 'react-bootstrap';
import Fuse from 'fuse.js';
import debounce from 'lodash/debounce';

const ExerciseSearch = ({ selectedDay, selectedSplit, liftTypes, onLiftSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [filteredLifts, setFilteredLifts] = useState([]);
    // Fuse.js options for searching
    const fuseOptions = {
        keys: [
            { name: 'name', weight: 2 },
            { name: 'bodyPart', weight: 1.5 },
            { name: 'equipment', weight: 1 },
            { name: 'type', weight: 1 },
            { name: 'desc', weight: 0.5 }
        ],
        threshold: 0.4, // lower vals = less results. def 0.6. 0.0 = perfect match
        distance: 100, // max distance from the expected result (def = 100)
        minMatchCharLength: 1 // min length of the search term to start searching (def = 1)
    };

    const getFilteredLifts = useCallback((term) => {
        if (!selectedSplit || !selectedDay || !term) return [];

        const dayBodyParts = selectedSplit.get(selectedDay) || [];
        const eligibleLifts = liftTypes.filter(lift => {
            const liftBodyPart = lift.get('bodyPart');

            return dayBodyParts.some(part => 
                liftBodyPart && liftBodyPart.toLowerCase() === part.toLowerCase()
            );
        });

        const searchableLifts = eligibleLifts.map(lift => ({
            id: lift.id,
            name: lift.get('name') || '',
            bodyPart: lift.get('bodyPart') || '',
            equipment: lift.get('equipment') || '',
            type: lift.get('type') || '',
            desc: lift.get('desc') || '',
            level: lift.get('level') || '',
            originalLift: lift
        }));

        const fuse = new Fuse(searchableLifts, fuseOptions);
        const results = fuse.search(term);

        setFilteredLifts(results.map(result => result.item.originalLift));
    }, [selectedSplit, selectedDay, liftTypes]);
    
    const debouncedSearch = useCallback(
        debounce((term)=> {
            getFilteredLifts(term);
        }, 300), [getFilteredLifts]);
    
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowResults(true);
        debouncedSearch(value);
    };

    const handleLiftSelect = (lift) => {
        onLiftSelect(lift);
        setSearchTerm('');
        setShowResults(false);
        setFilteredLifts([]);
    };

    return (
        <Form.Group className="mb-4">
            <Form.Label>Search Exercises</Form.Label>
            <Form.Control
                type="text"
                placeholder="Search by name, body part, or equipment..."
                value={searchTerm}
                onChange={handleSearchChange}
                autoComplete="off"
            />
            
            {showResults && searchTerm && (
                <Card className="mt-2">
                    <ListGroup>
                        {filteredLifts.map((lift) => (
                            <ListGroup.Item
                                key={lift.id}
                                action
                                onClick={() => handleLiftSelect(lift)}
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{lift.get('name')}</strong>
                                        <br />
                                        <small className="text-muted">
                                            {lift.get('bodyPart')} - {lift.get('equipment')}
                                        </small>
                                    </div>
                                    <span className="badge bg-secondary">{lift.get('level')}</span>
                                </div>
                            </ListGroup.Item>
                        ))}
                        {filteredLifts.length === 0 && (
                            <ListGroup.Item>No exercises found</ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>
            )}
        </Form.Group>
    );
};

export default ExerciseSearch;