import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddWorkoutChild from './AddWorkoutChild';
import workoutsService from '../../services/workoutsService';
import authService from '../../services/authService';
import { getCachedSplits, getCachedUserLiftTypes, updateCachesAfterWorkoutCreate } from '../../services/cacheService';
import liftsService from '../../services/liftsService';
import { Spinner } from 'react-bootstrap';

const AddWorkoutParent = () => {
	const user = authService.getCurrentUser();
	// I simplified the state to just one object to make this way easier to manage
	const [formData, setFormData] = useState({
		splits: [],
		liftTypes: [],
		error: "",
		workoutDates: {},
		selectedSplit: null,
		days: null,
		workouts: {},
		loading: true,
		submitLoading: false,
	});
	const Navigate = useNavigate();

	// load splits and lift types on mount
	useEffect(() => {
		const loadData = async () => {
			try {
				const [fetchedSplits, fetchedLiftTypes] = await Promise.all([
					 getCachedSplits(user.id),
					 getCachedUserLiftTypes(user.id)]);
				setFormData(prev =>({
					...prev,
					splits: fetchedSplits,
					liftTypes: fetchedLiftTypes,
					loading: false
				}));
			} catch (e) {
				setFormData(prev => ({
					...prev,
					error: 'Failed to load data: ' + e.message
				}));
				console.error('Error loading data:', e);
			}
		};
		loadData();
	}, [user]); // prop user technically

	// handle for updates to form
	const handleFormUpdate = (field, value) => {
		setFormData({
			...formData,
			[field]: value,
		});
	};

	// handle for submitting form
	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormData(prev => ({
			...prev,
			submitLoading: true,
			error: ''
		}));
		try {
			// creat lift objects
			const workoutPromises = Object.entries(formData.workouts).map(async ([day, lifts]) => {
				// create lifts
				const liftPromises = await Promise.all(lifts.map(liftData =>
					liftsService.addLift(
						liftData.liftType,
						parseInt(liftData.reps),
						parseInt(liftData.sets),
						parseInt(liftData.weight),
						user,
						new Date(formData.workoutDates[day]),
					)
				));
				
				// gotta slice to 8 because we only want 8 lifts (had problems with AI generating 9—which is whole other issue I don't want to deal with)
				const createdLifts = (await Promise.all(liftPromises)).slice(0, 8);
				const liftPointers = Array(8).fill(null);
				
				// get our pointers
				createdLifts.forEach((lift, index) => {
					liftPointers[index] = lift;
				});

				// create workout
				await workoutsService.addWorkout(
					user,
					new Date(formData.workoutDates[day]),
					...liftPointers,
					formData.selectedSplit,
					parseInt(day.slice(3), 10)
				);
			});
			// wait for all workouts to be created and update caches
			await Promise.all(workoutPromises).then(() => {
				updateCachesAfterWorkoutCreate(user.id);
			});
			Navigate('/calendar')
		} catch (e) {
			setFormData(prev => ({
				...prev,
				error: 'Failed to create workout: ' + e.message
			}));
			console.log('Error creating workout:', e);

		}
	};

	// handler for selecting a split
	const handleSplitSelect = async (splitId) => {
		try {
			// get the selected split from formData.splits
			const split = formData.splits.find((split) => split.id === splitId);
			const days = split.get('days');
			
			const initialDates = {};
			const initialWorkouts = {};
			for (let i = 1; i <= days; i++) {
				const dayKey = `day${i}`;
				initialDates[dayKey] = new Date().toISOString().split('T')[0];
				initialWorkouts[dayKey] = [];
			}
			setFormData({
				...formData,
				selectedSplit: split,
				days,
				workoutDates: initialDates,
				workouts: initialWorkouts,
			});
		} catch (e) {
			setFormData({
				...formData,
				error: 'Failed to select split: ' + e.message
			});
			console.error('Error selecting split:', e);
		}
 	};
	
	if (formData.loading) {
		return (
			<div>
				<h2>Loading...</h2>
				<Spinner animation="border" role="status">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			</div>
		)
	}
	return (
		<AddWorkoutChild
			formData={formData}
			onFormUpdate={handleFormUpdate}
			onSplitSelect={handleSplitSelect}
			onSubmit={handleSubmit}
			user={user}
		/>
	);
};

export default AddWorkoutParent;