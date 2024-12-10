import React from 'react';
import { Container } from 'react-bootstrap';
import AdvancedStatsParent from './AdvancedStatsParent';
import authService from '../../../../services/authService';

const AdvancedStatsContainer = () => {
  const currentUser = authService.getCurrentUser();

  return (
    <Container fluid>
      <AdvancedStatsParent currentUser={currentUser} />
    </Container>
  );
};

export default AdvancedStatsContainer;