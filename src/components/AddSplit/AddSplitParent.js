import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddSplitChild from './AddSplitChild';
import authService from '../../services/authService';
import splitService from '../../services/splitService';

const AddSplitParent = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const [error, setError] = useState('');
    // this is the data type we use throughout the component to make the split
    const [splitData, setSplitData] = useState({
        name: '',
        description: '',
        days: 0,
        setAsDefault: false,
        bodyparts: {
            day1: [], day2: [], day3: [],
            day4: [], day5: [], day6: []
        }
    });

    // handler thta handles the change of the split data
    const handleSplitDataChange = (field, value) => {
        setSplitData(prev => ({
            ...prev, // this just copies the previous state
            [field]: value,
            ...(field === 'days' && {
                bodyparts: {
                    day1: [], day2: [], day3: [],
                    day4: [], day5: [], day6: []
                }
            })
        }));
    };

    // handler that handles the change of the body part
    const handleBodyPartChange = (dayNum, bodyPart) => {
        const dayKey = `day${dayNum}`; // have to make a day key to access the correct day
        setSplitData(prev => ({
            ...prev, // copy the previous state
            bodyparts: {
                ...prev.bodyparts,                                              // copy the previous bodyparts
                [dayKey]: prev.bodyparts[dayKey].includes(bodyPart)             // check if the body part is already in the list
                    ? prev.bodyparts[dayKey].filter(part => part !== bodyPart)  // if it is, remove it
                    : [...prev.bodyparts[dayKey], bodyPart]                     // if it isn't, add it
            }
        }));
    };

    // handler that handles the submit of the split
    const handleSubmit = async () => {
        try {
            // add the split to the database
            const { name, description, days, bodyparts } = splitData;
            const bodyParts = Object.fromEntries(
                Object.entries(bodyparts).slice(0, days)
            );
            const savedSplit = await splitService.addSplit(
                name,
                description,
                days,
                ...Object.values(bodyParts)
            )

            // if the user wants to set the split as default, set it as default
            if (splitData.setAsDefault && savedSplit) {
                const currentUser = authService.getCurrentUser();
                await currentUser.set('defaultSplit', savedSplit).save();
            }

            navigate('/calendar');
        } catch (e) {
            setError('Failed to create split: ' + e.message);
            console.error('Error creating split:', error);
        }
    };

    return (
        <AddSplitChild
            splitData={splitData}
            onSplitDataChange={handleSplitDataChange}
            onBodyPartChange={handleBodyPartChange}
            onSubmit={handleSubmit}
            user={user}
        />
    );
};
export default AddSplitParent;