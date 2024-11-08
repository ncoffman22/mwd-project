import React from 'react';
import { Form } from 'react-bootstrap';

export default function SplitChild({ split, selectedSplit, onSelectSplit }) {
    // If there are any splits, iterate over them and add them to the dropdown
    return (
        split && (
            <Form.Group controlId="splitSelector">
                <Form.Control
                    as="select"
                    value={selectedSplit}
                    onChange={(e) => onSelectSplit(e.target.value)}
                >
                    <option value="">Select a Split</option>
                    {split.map((split, index) => ( // each must have a unique key
                        <option key={index} value={split.objectId}>
                            {split.split_title}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
        )
    );
}
