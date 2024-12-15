import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { getCachedUserLiftTypes, getCachedSplits } from '../../services/cacheService';
import { Tabs, Tab, Card } from 'react-bootstrap';
import LiftTypeList from './components/LiftType/LiftTypeList';
import SplitList from './components/Split/SplitList';
import SearchBar from './components/LiftType/SearchBar';

const WikiParent = () => {
    const [data, setData] = useState({
        liftTypes: [],
        splits: [],
        loading: true,
        activeTab: 'exercises',
        searchTerm: '',
        filters: {
            bodyPart: '',
            equipment: '',
            level: ''
        },
        fuse: null
    });

    // Function to update data in state
    const updateData = (field, item) => {
        setData(prev => ({
            ...prev,
            [field]: item
        }));
    };

    // Function to handle filter changes
    const handleFilterChange = (filterType, value) => {
        setData(prev => ({
            ...prev,
            filters: {
                ...prev.filters,
                [filterType]: value
            }
        }));
    };

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const [liftTypeData, splitData] = await Promise.all([
                    getCachedUserLiftTypes(),
                    getCachedSplits()
                ]);
                
                // Initialize Fuse instance
                const fuseOptions = {
                    keys: [
                        {
                            name: 'name',
                            getFn: (liftType) => liftType.get('name')
                        },
                        {
                            name: 'desc',
                            getFn: (liftType) => liftType.get('desc')
                        }
                    ],
                    threshold: 0.3,
                    location: 0,
                    distance: 100,
                    minMatchCharLength: 2
                };

                const fuse = new Fuse(liftTypeData, fuseOptions);
                
                setData(prev => ({
                    ...prev,
                    liftTypes: liftTypeData,
                    splits: splitData,
                    fuse: fuse
                }));
            } catch (error) {
                console.error('Error loading data:', error);
                setData(prev => ({ ...prev, loading: false }));
            } finally {
                setData(prev => ({ ...prev, loading: false }));
            }
        };
        loadData();
    }, []);

    // Function to get the filtered exercises based on search term and filters
    const getFilteredExercises = () => {
        let results = data.liftTypes;

        // Apply search if there's a search term
        if (data.searchTerm && data.fuse) {
            const searchResults = data.fuse.search(data.searchTerm);
            results = searchResults.map(result => result.item);
        }
        // Apply filters
        return results.filter(liftType => {
            const matchesBodyPart = !data.filters.bodyPart || liftType.get('bodyPart') === data.filters.bodyPart;
            const matchesEquipment = !data.filters.equipment || liftType.get('equipment') === data.filters.equipment;
            const matchesLevel = !data.filters.level || liftType.get('level') === data.filters.level;
            
            return matchesBodyPart && matchesEquipment && matchesLevel;
        });
    };

    const filteredExercises = getFilteredExercises();

    return (
        <Card className="mt-4">
            <Card.Header className="bg-primary text-white">
                <h2>Exercise & Split Wiki</h2>
            </Card.Header>
            <Card.Body>
                <Tabs
                    activeKey={data.activeTab}
                    onSelect={(key) => updateData('activeTab', key)}
                    className="mb-4"
                >
                    <Tab eventKey="exercises" title={`Exercises (${filteredExercises.length})`}>
                        <div className="mb-4">
                            <SearchBar 
                                data={data}
                                onSearchChange={(term) => updateData('searchTerm', term)}
                                onFilterChange={handleFilterChange}
                            />
                        </div>
                        <LiftTypeList 
                            liftTypes={filteredExercises}
                            loading={data.loading}
                        />
                    </Tab>
                    <Tab eventKey="splits" title={`Splits (${data.splits.length})`}>
                        <SplitList 
                            splits={data.splits}
                            loading={data.loading}
                        />
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    );
};

export default WikiParent;