import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddSplitChild from './AddSplitChild';
import authService from '../../services/authService';
import splitService from '../../services/splitService';
import { updateCacheAfterSplitCreate } from '../../services/cacheService';

const AddSplitParent = () => {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();

    // this is the data type we use throughout the component to make the split
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        days: '',
        setAsDefault: false,
        bodyParts: Object.fromEntries([1,2,3,4,5,6].map(day => [day, []])),
        error: ''
    });

    const handleChange = (field, item) => {
        setFormData(prev => ({
            ...prev,
            [field]: item,
            ...(field === 'days' && {       // if the field is days, reset the body parts
                bodyParts: {
                    1: [], 2: [], 3: [],
                    4: [], 5: [], 6: []
                }
             })
        }));
    }

    const handleBodyPartChange = (day, item) => {
        setFormData(prev => ({
            ...prev, 
            bodyParts: {
                ...prev.bodyParts,                                          // copy the previous bodyparts
                [day]: prev.bodyParts[day].includes(item)                   // check if the body part is already in the list
                    ? prev.bodyParts[day].filter(part => part !== item)     // if it is, remove it
                    : [...prev.bodyParts[day], item]                        // if it isn't, add it
            }
        }));
    };

    // handler that handles the submit of the split
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // create an array of body parts for each day to match splitServices
            const bodyPartsArray = Array.from({ length: 6 }, (_, i) => {
                const day = i + 1;
                if (formData.bodyParts[day].length === 0) {
                    return [];
                } else {
                    return formData.bodyParts[day];
                }
            });
            const savedSplit = await splitService.addSplit(
                formData.name,
                formData.description,
                parseInt(formData.days),
                ...bodyPartsArray,
                currentUser
            );
            // if the user wants to set the split as default, set it as default
            if (formData.setAsDefault && savedSplit) {
                await currentUser.set('defaultSplit', savedSplit).save();
            }
            updateCacheAfterSplitCreate(currentUser.id);
            navigate('/calendar');
        } catch (e) {
            handleChange('error', e);
            console.error('Error creating split:', e);
        }
    };

    return (
        <AddSplitChild
            formData={formData}
            onChange={handleChange}
            onBodyPartChange={handleBodyPartChange}
            onSubmit={handleSubmit}
            user={currentUser}
        />
    );
};
export default AddSplitParent;