import React from 'react';
import ProfilePicture from './ProfilePicture';

import UserDetails from './UserDetails'
export default function AccountContainer() {
    return (
        <div>
            <ProfilePicture />
            <UserDetails />
        </div>
    )
}