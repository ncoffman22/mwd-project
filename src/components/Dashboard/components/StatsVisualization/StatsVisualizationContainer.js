import React from 'react';
import StatsVisualizationParent from './StatsVisualizationParent';
import { Container } from 'react-bootstrap';
import authService from '../../../../services/authService';

const StatsVisualizationContainer = () => {
    const currentUser = authService.getCurrentUser();
    return (
        <Container>       
             <StatsVisualizationParent currentUser={currentUser}/>
        </Container>
    );
};

export default StatsVisualizationContainer;