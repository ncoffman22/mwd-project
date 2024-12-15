import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Row, Col, Badge, Form, InputGroup } from 'react-bootstrap';
import debounce from 'lodash/debounce';

const SearchBar = ({ data, onSearchChange, onFilterChange }) => {
    // unique values from back4app
    const bodyParts = [
        'Abdominals', 'Biceps', 'Calves', 'Chest', 'Forearms',
        'Glutes', 'Hamstrings', 'Lats', 'Lower Back', 'Middle Back',
        'Shoulders', 'Triceps', 'Quadriceps'
    ];
    
    const equipmentTypes = [
        'Bands', 'Barbell', 'Body Only', 'Cable', 'Dumbbell',
        'E-Z Curl Bar', 'Exercise Ball', 'Foam Roll', 'Kettlebells',
        'Machine', 'Medicine Ball', 'None', 'Other'
    ];
    
    const levels = ['Beginner', 'Intermediate', 'Expert'];

    const [inputValue, setInputValue] = useState(data.searchTerm || '');

    const debouncedSearch = useMemo(
        () => debounce((term) => {
            onSearchChange(term);
        }, 300),
        [onSearchChange]
    );
    
    const handleChange = useCallback((e) => {
        const searchTerm = e.target.value;
        setInputValue(searchTerm);
        debouncedSearch(searchTerm);
    }, [debouncedSearch]);
    
    
    useEffect(() => {
        setInputValue(data.searchTerm || '');
    }, [data.searchTerm]);
    
    useEffect(() => {
        return () => debouncedSearch.cancel();
    }, [debouncedSearch]);

    return (
        <div>
            <div className="mb-3">
                <Form.Group className="mb-3">
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Search exercises..."
                            defaultValue={inputValue}
                            onChange={handleChange}
                        />
                    </InputGroup>
                </Form.Group>
            </div>
            <div className="mb-3">
                <Row className="g-3 mb-3">
                    <Col md={4}>
                        {/* Body Part Filter */}
                        <Form.Group>
                            <Form.Label>Body Part</Form.Label>
                            <Form.Select
                                value={data.filters.bodyPart}
                                onChange={(e) => onFilterChange('bodyPart', e.target.value)}
                            >
                                <option value="">All Body Parts</option>
                                {bodyParts.map(part => (
                                    <option key={part} value={part}>{part}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        {/* Equipment Filter */}
                        <Form.Group>
                            <Form.Label>Equipment</Form.Label>
                            <Form.Select
                                value={data.filters.equipment}
                                onChange={(e) => onFilterChange('equipment', e.target.value)}
                            >
                                <option value="">All Equipment</option>
                                {equipmentTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        {/* Level Filter */}
                        <Form.Group>
                            <Form.Label>Level</Form.Label>
                            <Form.Select
                                value={data.filters.level}
                                onChange={(e) => onFilterChange('level', e.target.value)}
                            >
                                <option value="">All Levels</option>
                                {levels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                {/* Active Filters */}
                {(data.filters.bodyPart || data.filters.equipment || data.filters.level) && (
                    <div className="d-flex gap-2 flex-wrap">
                        {Object.entries(data.filters).map(([key, value]) => 
                            value && (
                                <Badge 
                                    key={key}
                                    bg="secondary" 
                                    className="p-2 cursor-pointer"
                                    onClick={() => onFilterChange(key, '')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {key === 'bodyPart' ?  (`Body Part`) : (key === 'equipment' ? (`Equipment`) : (`Level`)) }: {value} ×
                                </Badge>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
export default SearchBar;