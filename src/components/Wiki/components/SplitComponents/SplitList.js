import React from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import SplitCard from './SplitCard';

export default function SplitList({ splits, loading }) {
    if (loading) {
        return (
            <div className="text-center py-4">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (splits.length === 0) {
        return (
            <div className="text-center py-4">
                <p>No splits available.</p>
            </div>
        );
    }

    return (
        <Row xs={1} md={2} className="g-4">
            {splits.map(split => (
                <Col key={split.id}>
                    <SplitCard split={split} />
                </Col>
            ))}
        </Row>
    );
}
