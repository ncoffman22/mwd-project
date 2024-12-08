import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddWorkoutChild from './AddWorkoutChild';
import authService from '../../services/authService';
import splitService from '../../services/splitService';
import liftTypesService from '../../services/liftTypesService';
import liftsService from '../../services/liftsService';
import workoutsService from '../../services/workoutsService';

const AddWorkoutParent = () => {
	const navigate = useNavigate();
	const user = authService.getCurrentUser();
	const [splits, setSplits] = useState([]);
	const [selectedSplit, setSelectedSplit] = useState(null);
	const [liftTypes, setLiftTypes] = useState([]);
	const [selectedLifts, setSelectedLifts] = useState({});
	const [workoutDates, setWorkoutDates] = useState({});
	const [error, setError] = useState('');

	// Load splits and lift types on component mount
	useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedSplits = await splitService.getSplit();
				const fetchedLiftTypes = await liftTypesService.getLiftTypes();
				setSplits(fetchedSplits);
				setLiftTypes(fetchedLiftTypes);
			} catch (e) {
				setError('Failed to load data: ' + e.message);
				console.error('Error loading data:', e);
			}
		};
		loadData();
	}, []);

	// handler for selecting a split
	const handleSplitSelect = async (splitId) => {
		try {
			const split = await splitService.oGetSplit(splitId);
			setSelectedSplit(split[0]);
			// Initialize dates for all days
			const initialDates = {};
			for (let i = 1; i <= split[0].get('days'); i++) {
				initialDates[`day${i}`] = new Date().toISOString().split('T')[0];
			}
			setWorkoutDates(initialDates);
			setSelectedLifts({});
		} catch (e) {
			setError('Failed to load split details');
			console.error('Error loading split:', error);
		}
	};

	// handler for selecting a lift
	const handleLiftSelect = (day, liftData) => {
		setSelectedLifts(prev => ({
			...prev,
			[day]: [...(prev[day] || []), liftData] // Append to existing lifts or create new array
		}));
	};

	// handler for removing a lift
	const handleRemoveLift = (day, index) => {
		setSelectedLifts(prev => {
			const newLifts = {
				...prev,
				[day]: prev[day].filter((_, i) => i !== index)
			};
			
			if (newLifts[day].length === 0) {
				const { [day]: _, ...rest } = newLifts;
				return rest;
			}
			
			return newLifts;
		});
	};

	// handler for changing the date
	const handleDateChange = (day, date) => {
		setWorkoutDates(prev => ({
			...prev,
			[day]: date
		}));
	};

	// handler for submitting the form
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// create workouts for each day
			const workoutPromises = Object.entries(selectedLifts).map(async ([day, lifts]) => {
				// need to make the lifts first to get the pointers
				const liftPromises = lifts.map(liftData => 
					liftsService.addLift(
						liftData.liftType,
						parseInt(liftData.reps),
						parseInt(liftData.sets),
						parseFloat(liftData.weight),
						user,
						new Date(workoutDates[day])
					)
				);

				const createdLifts = await Promise.all(liftPromises);
				
				// map created lifts to workout structure
				const workoutLifts = {};
				createdLifts.slice(0, 8).forEach((lift, index) => {
					workoutLifts[`lift${index + 1}`] = lift;
				});

				// pad with null values if less than 8 lifts
				for (let i = createdLifts.length + 1; i <= 8; i++) {
					workoutLifts[`lift${i}`] = null;
				}
				
				// parse the day number
				const dayNumber = parseInt(day.slice(3), 10);

				// create workout for this day
				return workoutsService.addWorkout(
					user,
					new Date(workoutDates[day]),
					workoutLifts.lift1,
					workoutLifts.lift2,
					workoutLifts.lift3,
					workoutLifts.lift4,
					workoutLifts.lift5,
					workoutLifts.lift6,
					workoutLifts.lift7,
					workoutLifts.lift8,
					selectedSplit,
					dayNumber,
				);
			});

			await Promise.all(workoutPromises);
			navigate('/calendar');
		} catch (err) {
			setError('Failed to create workouts: ' + err.message);
			console.error('Error creating workouts:', err);
		}
	};

	return (
		<AddWorkoutChild
			splits={splits}
			selectedSplit={selectedSplit}
			liftTypes={liftTypes}
			selectedLifts={selectedLifts}
			workoutDates={workoutDates}
			onDateChange={handleDateChange}
			onSplitSelect={handleSplitSelect}
			onLiftSelect={handleLiftSelect}
			onRemoveLift={handleRemoveLift}
			onSubmit={handleSubmit}
			user={user}
		/>
	);
};

export default AddWorkoutParent;