import React from 'react';
import { Row, Col, Form, Badge } from 'react-bootstrap';

const bodyParts = [
    'Abdominals', 'Biceps', 'Calves', 'Chest', 'Forearms',
    'Glutes', 'Hamstrings', 'Lats', 'Lower Back', 'Middle Back',
    'Shoulders', 'Triceps', 'Quadriceps'
];

const equipmentTypes = [
    'Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight',
    'Resistance Band', 'Kettlebell', 'Smith Machine'
];

const levels = ['Beginner', 'Intermediate', 'Expert'];

const FilterBar = ({ filters, onFilterChange, onClearFilter }) => {
    return (
        <div className="mb-3">
            <Row className="g-3 mb-3">
                <Col md={4}>
                    {/* Body Part Filter */}
                    <Form.Group>
                        <Form.Label>Body Part</Form.Label>
                        <Form.Select
                            value={filters.bodyPart}
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
                            value={filters.equipment}
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
                            value={filters.level}
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
            {(filters.bodyPart || filters.equipment || filters.level) && (
                <div className="d-flex gap-2 flex-wrap">
                    {Object.entries(filters).map(([key, value]) => 
                        value && (
                            <Badge 
                                key={key}
                                bg="secondary" 
                                className="p-2 cursor-pointer"
                                onClick={() => onClearFilter(key)}
                                style={{ cursor: 'pointer' }}
                            >
                                {key}: {value} ×
                            </Badge>
                        )
                    )}
                </div>
            )}
        </div>
    );
};
export default FilterBar;