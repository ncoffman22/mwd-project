import authService from "../../services/authService";
import React, { useState, useEffect } from "react";
import {  Nav, Tab, Spinner } from 'react-bootstrap';
import { getCachedUserWorkouts, getCachedUserLifts, getCachedUserLiftTypes } from '../../services/cacheService';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import statisticsService from '../../services/statisticsService';
import StatsVisualizationContainer from "./components/StatsVisualization/StatsVisualizationContainer";
import AdvancedStatsContainer from "./components/AdvancedStats/AdvancedStatsContainer";
import HomeTabContainer from "./components/HomeTab/HomeTabContainer";
dayjs.extend(utc);
dayjs.extend(timezone);
const DashboardParent = () => {
    const [data, setData] = useState({
        workouts: [],
        statistics: [],
        loading: true,
        error: null,
        liftTypes: []
    });
    const currentUser = authService.getCurrentUser();
    useEffect(() => {
        const loadWorkoutData = async () => {
            try {
                const userWorkouts = await getCachedUserWorkouts(currentUser.id);
                const liftTypes = await getCachedUserLiftTypes(currentUser.id);

                const processedWorkouts = await Promise.all(userWorkouts.map(async (workout) => {
                    const workoutLifts = [];
                    
                    // Process lifts 1-8 directly from workout object
                    for (let i = 1; i <= 8; i++) {
                        const liftPointer = workout.get(`lift${i}`);
                        if (!liftPointer) continue;
                        
                        try {
                            // Get the lift type from the lift pointer
                            const liftType = liftPointer.get('liftType');
                            if (!liftType) continue;

                            workoutLifts.push({
                                id: liftPointer.id,
                                name: liftType.get('name'),
                                sets: liftPointer.get('sets'),
                                reps: liftPointer.get('reps'),
                                weight: liftPointer.get('weight'),
                                type: liftType.get('type'),
                                bodyPart: liftType.get('bodyPart'),
                                completed: liftPointer.get('completed'),
                                passedSets: liftPointer.get('passedSets') || [],
                                failedSets: liftPointer.get('failedSets') || []
                            });
                            
                        } catch (error) {
                            console.warn(`Error processing lift${i}:`, error);
                        }
                    }

                    const split = workout.get('split');
                    const day = workout.get('day');
                    const datePerformed = workout.get('datePerformed');
                    const adjustedDate = dayjs(datePerformed)
                        .add(datePerformed.getTimezoneOffset(), 'minutes')
                        .toDate();


                    return {
                        id: workout.id,
                        completed: workout.get('completed'),
                        date: adjustedDate,
                        split: split,
                        bodyParts: split ? split.get(`day${day}`) : [],
                        splitName: split ? split.get('name') : 'No Split',
                        day: day || 'Unassigned',
                        lifts: workoutLifts,
                        totalExercises: workoutLifts.length
                    };
                }));

                const stats = await statisticsService.getUserStatistics();
                setData({
                    workouts: processedWorkouts,
                    loading: false,
                    error: null,
                    liftTypes: liftTypes,
                    statistics: stats
                });
            } catch (error) {
                console.error('Error loading workout data:', error);
                setData(prev => ({
                    ...prev,
                    loading: false,
                    error: error.message
                }));
            }
        };

        loadWorkoutData();
    }, [currentUser.id]);

    if (data.loading) {
        return (
            <div>
                <h2>Loading...</h2>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        )
    }
    return (
            <div>
                <h2>Welcome!</h2>
                <Tab.Container id="dashboard-tabs" defaultActiveKey="home">
                    <Nav variant="tabs" className="mb-3">
                        <Nav.Item>
                            <Nav.Link eventKey="home">Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="stats">Stats</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="advancedstats">Even More Stats</Nav.Link>
                        </Nav.Item>                   
                    </Nav>
                    <Tab.Content>
                        <Tab.Pane eventKey="home">
                            <HomeTabContainer data={data} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="stats">
                            <StatsVisualizationContainer data={data} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="advancedstats">
                            <AdvancedStatsContainer />
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </div>
    );
}; 


export default DashboardParent;