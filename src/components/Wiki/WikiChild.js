import React from 'react';
import { Tabs, Tab, Card } from 'react-bootstrap';
import ExerciseList from './components/ExerciseComponents/ExerciseList';
import SplitList from './components/SplitComponents/SplitList';
import SearchBar from './components/ExerciseComponents/SearchBar';
import FilterBar from './components/ExerciseComponents/FilterBar';

const WikiChild = ({
    exercises,
    splits,
    loading,
    activeTab,
    onTabChange,
    searchTerm,
    onSearch,
    filters,
    onFilterChange,
    onClearFilter
}) => {
    return (
        <Card className="mt-4">
            <Card.Header>
                <h2>Exercise & Split Wiki</h2>
            </Card.Header>
            <Card.Body>
                <Tabs
                    activeKey={activeTab}
                    onSelect={onTabChange}
                    className="mb-4"
                >
                    <Tab eventKey="exercises" title={`Exercises (${exercises.length})`}>
                        <div className="mb-4">
                            <SearchBar 
                                value={searchTerm}
                                onChange={onSearch}
                            />
                            <FilterBar 
                                filters={filters}
                                onFilterChange={onFilterChange}
                                onClearFilter={onClearFilter}
                            />
                        </div>
                        <ExerciseList 
                            exercises={exercises}
                            loading={loading}
                        />
                    </Tab>
                    <Tab eventKey="splits" title={`Splits (${splits.length})`}>
                        <SplitList 
                            splits={splits}
                            loading={loading}
                        />
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    );
};

export default WikiChild;