import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import WikiChild from './WikiChild';
import liftTypesService from '../../services/liftTypesService';
import splitService from '../../services/splitService';

const WikiParent = () => {
    const [exercises, setExercises] = useState([]);
    const [splits, setSplits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('exercises');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        bodyPart: '',
        equipment: '',
        level: ''
    });
    
    // State for the Fuse instance
    const [fuse, setFuse] = useState(null);

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const [exerciseData, splitData] = await Promise.all([
                    liftTypesService.getLiftTypes(),
                    splitService.getSplit()
                ]);
                setExercises(exerciseData);
                setSplits(splitData);
                
                // Initialize Fuse instance
                const fuseOptions = {
                    keys: [
                        {
                            name: 'name',
                            getFn: (exercise) => exercise.get('name')
                        },
                        {
                            name: 'desc',
                            getFn: (exercise) => exercise.get('desc')
                        }
                    ],
                    threshold: 0.3,
                    location: 0,
                    distance: 100,
                    minMatchCharLength: 2
                };
                setFuse(new Fuse(exerciseData, fuseOptions));
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Handle search term change
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Handle filter change
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    // Clear a filter
    const clearFilter = (filterType) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: ''
        }));
    };

    // Function to get the filtered exercises based on search term and filters
    const getFilteredExercises = () => {
        let results = exercises;

        // If there's a search term and Fuse is initialized, use fuzzy search
        if (searchTerm && fuse) {
            results = fuse.search(searchTerm).map(result => result.item);
        }

        // Apply filters
        return results.filter(exercise => {
            const matchesBodyPart = !filters.bodyPart || exercise.get('bodyPart') === filters.bodyPart;
            const matchesEquipment = !filters.equipment || exercise.get('equipment') === filters.equipment;
            const matchesLevel = !filters.level || exercise.get('level') === filters.level;
            
            return matchesBodyPart && matchesEquipment && matchesLevel;
        });
    };

    // Get the filtered exercises
    const filteredExercises = getFilteredExercises();

    return (
        <WikiChild 
            exercises={filteredExercises}
            splits={splits}
            loading={loading}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilter={clearFilter}
        />
    );
}
export default WikiParent;