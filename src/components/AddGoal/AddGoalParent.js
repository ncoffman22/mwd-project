import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddGoalChild from './AddGoalChild';
import authService from '../../services/authService';
import { getCachedUserLiftTypes } from '../../services/cacheService';

const AddGoalParent = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const [formData, setFormData] = useState({
        liftTypes: [],
        goals: {},
        loading: true,
        error: ''
    });

    // hanlder to update form data
    const updateFormData = (field, item) => {
        setFormData(prev => ({
            ...prev,
            [field]: item
        }));
    }
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load lift types
                const fetchedLiftTypes = await getCachedUserLiftTypes(user.id);
                updateFormData('liftTypes', fetchedLiftTypes);

                const currentUser = authService.getCurrentUser();
                const existingGoals = currentUser.get('goals') || {};
                updateFormData('goals', existingGoals);
            } catch (e) {
                console.error('Error loading data:', e);
                updateFormData('error', 'Failed to load data: ' + e.message);
            } finally {
                updateFormData('loading', false);
            }
        };
        loadData();
    }, [user]);

    // handler to update the goal
    const handleGoalChange = (liftTypeId, value) => {
        setFormData(prev => ({
            ...prev,
            goals: {
                ...prev.goals,
                [liftTypeId]: value ? parseFloat(value) : null
            }
        }));
    }

    // handler to submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Filter out null/undefined values
            const cleanedGoals = Object.fromEntries(
                Object.entries(formData.goals).filter(([_, value]) => value != null)
            );
            authService.update(user, cleanedGoals);
            navigate('/dashboard');
        } catch (error) {
            setFormData(prev => ({
                ...prev,
                error: 'Failed to save goals: ' + error.message
            }));
            console.error('Error saving goals:', error);
        }
    };

    return (
        <AddGoalChild
            formData={formData}
            onGoalChange={handleGoalChange}
            onSubmit={handleSubmit}
        />
    );
};

export default AddGoalParent;