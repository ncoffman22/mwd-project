import React from "react";
import DashboardParent from "./DashboardParent";
import { Container } from "react-bootstrap";
import StatsVisualizationContainer from "./components/StatsVisualization/StatsVisualizationContainer";
import AdvancedStatsContainer from "./components/AdvancedStats/AdvancedStatsContainer";
export default function DashboardContainer( ) {
        return (
            <Container>
                <DashboardParent />
            </Container>
        );
}
