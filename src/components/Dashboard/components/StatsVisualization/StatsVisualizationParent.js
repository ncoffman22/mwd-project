import React, { useState, useEffect, useCallback } from 'react';
import { Card } from 'react-bootstrap';
import StatsVisualizationChild from './StatsVisualizationChild';
import { getCachedUserStatistics } from '../../../../services/cacheService';

const StatsVisualizationParent = ({ currentUser }) => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchStatistics = useCallback(async () => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        try {
            const results = await getCachedUserStatistics(currentUser.id);
            setStatistics(results);
        } catch (err) {
            console.error('Error fetching statistics:', err);
            setError('Failed to load statistics');
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    if (loading) {
        return (
            <Card>
                <Card.Body>Loading statistics...</Card.Body>
            </Card>
        );
    }


    if (!statistics) {
        return (
            <Card>
                <Card.Body>No statistics available</Card.Body>
            </Card>
        );
    }

    return (
        <StatsVisualizationChild 
            statistics={statistics}
            currentUser={currentUser}
        />
    );
};

export default StatsVisualizationParent;