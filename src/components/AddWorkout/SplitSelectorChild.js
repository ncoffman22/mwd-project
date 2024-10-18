import React from 'react';
import { Form, Button } from 'react-bootstrap';

export default function SplitChild({ split, selectedSplit, onSelectSplit }) {
    return (
        <Form.Group controlId="splitSelector">
            <Form.Control
                as="select"
                value={selectedSplit}
                onChange={(e) => onSelectSplit(e.target.value)}
            >
                <option value="">Select a Split</option>
                {split.map((split) => (
                    <option key={split.id} value={split.id}>
                        {split.name}
                    </option>
                ))}
            </Form.Control>
        </Form.Group>
    )
}