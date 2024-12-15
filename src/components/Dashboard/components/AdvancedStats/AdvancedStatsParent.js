import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import AdvancedStatsChild from './AdvancedStatsChild';
import { getCachedUserStatistics } from '../../../../services/cacheService';
import { Card } from 'react-bootstrap';

const AdvancedStatsParent = ({ currentUser }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statistics, setStatistics] = useState(null);

    // Fetch advanced statistics for the current user
    useEffect(() => {
        const fetchAdvancedStats = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                const results = await getCachedUserStatistics(currentUser.id);
                setStatistics(results);
            } catch (err) {
                console.error('Error fetching advanced statistics:', err);
                setError('Failed to load advanced statistics. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAdvancedStats();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

if (error) {
        return (
                <Card>
                        <Card.Body className="text-danger">{error}</Card.Body>
                </Card>
        );
}
    if (!statistics || statistics.length === 0) {
        return (
            <Alert variant="info">
                No workout data available. Start tracking your workouts to see advanced statistics!
            </Alert>
        );
    }

    return <AdvancedStatsChild statistics={statistics} />;
};

export default AdvancedStatsParent;