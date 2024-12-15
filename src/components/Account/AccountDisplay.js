import React, { useState, useEffect } from 'react';
import accountService from '../../services/accountService';

export default function AccountDisplay() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const data = await accountService.getData();
            // Convert birthDate to a string
            if (data && data.birthDate) {
                const birthDate = new Date(data.birthDate).toLocaleDateString();
                data.birthDate = birthDate; // Update the birthDate field to the formatted string
            }
            setUserData(data);
        };
        getData();
    }, []);

    return (
        <div className="account-display-container">
            {userData ? (
                <div className="user-card">
                    <h1 className="user-name">{userData.name}</h1>
                    <p className="user-info"><strong>Birthday:</strong> {userData.birthDate}</p>
                    <p className="user-info"><strong>Height:</strong> {userData.height} cm</p>
                    <p className="user-info"><strong>Weight:</strong> {userData.weight} kg</p>
                    <p className="user-info"><strong>Birth Sex:</strong> {userData.birthSex ? "Male" : "Female"}</p>
                    <p className="user-info"><strong>Default Workout Split:</strong> {userData.defaultSplit}</p>
                </div>
            ) : (
                <div className="loading">Loading user data...</div>
            )}
        </div>
    );
}
