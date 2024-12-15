import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import HomeTabParent from './HomeTabParent';
import authService from '../../../../services/authService';
import Parse from 'parse';

const HomeTabContainer = ({ data }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                try {
                    const query = new Parse.Query(Parse.User);
                    const user = await query.get(currentUser.id);
                    setUserData(user);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        loadUserData();
    }, []);

    return (
        <Container>
            <HomeTabParent data={data} user={userData} />
        </Container>
    );
};
export default HomeTabContainer;