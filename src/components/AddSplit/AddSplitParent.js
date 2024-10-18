import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddSplitChild from "./AddSplitChild";
import splitService from "../../services/splitService";
import workoutService from "../../services/workoutService";

export default function AddSplitParent({ user }) {
    const [split, setSplit] = useState({
        split_title: '',
        date: new Date().toISOString().split('T')[0],
        workout_1: null,
        workout_2: null,
        workout_3: null,
        workout_4: null,
        workout_5: null,
        workout_6: null,
        workout_7: null,
        workout_8: null,
    });

    const [availableWorkouts, setAvailableWorkouts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkouts = async () => {
            const fetchedWorkouts = await workoutService.loadWorkouts(user.username);
            setAvailableWorkouts(fetchedWorkouts);
        };
        fetchWorkouts();
    }, [user.username]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSplit((prevSplit) => ({
            ...prevSplit,
            [name]: value,
        }));
    };

    const handleWorkoutsChange = (workoutKey, workoutId) => {
        setSplit((prevSplit) => ({
            ...prevSplit,
            [workoutKey]: workoutId,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await splitService.addSplit(user.username, split);
            navigate('/splits');
        } catch (error) {
            console.error('Failed to add split:', error);
        }
    };

    return (
        <AddSplitChild
            split={split}
            availableWorkouts={availableWorkouts}
            onChange={handleChange}
            onWorkoutsChange={handleWorkoutsChange}
            onSubmit={handleSubmit}
        />
    );
}
