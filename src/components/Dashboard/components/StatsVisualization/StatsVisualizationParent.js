import React, { useState, useEffect, useCallback } from 'react';
import { Card, Alert } from 'react-bootstrap';
import StatsVisualizationChild from './StatsVisualizationChild';
import { getCachedUserStatistics } from '../../../../services/cacheService';

const StatsVisualizationParent = ({ currentUser }) => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch statistics from the cache
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

    if (error) {
        return (
            <Alert variant="danger">
                Sorry we cannot load your statistics at this time: {error}
            </Alert>
        );
    }

    if (!statistics || statistics.length === 0) {
        return (
          <Alert variant="info">
            No workout data available. Start tracking your workouts to see advanced statistics!
          </Alert>
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