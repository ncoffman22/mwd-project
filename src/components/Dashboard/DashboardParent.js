import React from "react";
import DashboardChild from "./DashboardChild";
import { Card } from "react-bootstrap";
import authService from "../../services/authService";
import StatsVisualizationContainer from "./components/StatsVisualization/StatsVisualizationContainer";
import AdvancedStatsContainer from "./components/AdvancedStats/AdvancedStatsContainer";
export default function DashboardParent({ workouts }) {
    // if there is no user just return a loading screen for now. Probably will change this a login link at
    // some point.
    const user = authService.getCurrentUser()
    if (!user) {
        return (
            <Card>
                <Card.Header as="h1">Weightlifting Tracker Dashboard</Card.Header>
                <Card.Body>
                    <p>Loading ...</p>
                </Card.Body>
            </Card>
        );
    }
    
    return (
        <Card>
            <Card.Header as="h1">Weightlifting Tracker Dashboard</Card.Header>
            <Card.Body>
                <DashboardChild username={user.get("username")} workouts={workouts || []} />
                <StatsVisualizationContainer />
                <AdvancedStatsContainer />
            </Card.Body>
        </Card>
    );
}
