import Parse from 'parse';

const workoutsService = {
    addWorkout: async (user, datePerformed, lift1, lift2, lift3, lift4, lift5, lift6, lift7, lift8, split, day) => {
        const newWorkout = new Parse.Object('Workouts');
        
        // Create a pointer to the User class
        const userPointer = new Parse.User();
        userPointer.id = user.id || user.objectId;
        newWorkout.set('user', userPointer);
        
        // Set date
        newWorkout.set('datePerformed', new Date(datePerformed));
        
        // Handle lift pointers
        const lifts = [lift1, lift2, lift3, lift4, lift5, lift6, lift7, lift8];
        lifts.forEach((lift, index) => {
            if (lift) {
                const liftPointer = new Parse.Object('Lifts');
                liftPointer.id = lift.id || lift.objectId;
                newWorkout.set(`lift${index + 1}`, liftPointer);
            }
        });

        // Handle split pointer if provided
        if (split) {
            const splitPointer = new Parse.Object('WorkoutSplits');
            splitPointer.id = split.id || split.objectId;
            newWorkout.set('split', splitPointer);
        }

        if (day) {
            newWorkout.set('day', day);
        }

        try {
            const result = await newWorkout.save();
            return result;
        } catch (error) {
            console.error('Error adding workout:', error);
            throw error;
        }
    },

    uGetWorkout: async (user) => {
        const Workouts = Parse.Object.extend('Workouts');
        const query = new Parse.Query(Workouts);
        
        // Create user pointer for query
        const userPointer = new Parse.User();
        userPointer.id = user.id || user.objectId;
        query.equalTo('user', userPointer);
        
        // Include related objects
        query.include('lift1');
        query.include('lift2');
        query.include('lift3');
        query.include('lift4');
        query.include('lift5');
        query.include('lift6');
        query.include('lift7');
        query.include('lift8');
        query.include('split');
        
        // Sort by date performed, most recent first
        query.descending('datePerformed');

        try {
            const results = await query.find();
            return results;
        } catch (error) {
            console.error('Error fetching workouts:', error);
            throw error;
        }
    },

    oGetWorkout: async (objectId) => {
        const Workouts = Parse.Object.extend('Workouts');
        const query = new Parse.Query(Workouts);
        query.equalTo('objectId', objectId);
        
        // Include related objects
        query.include('lift1');
        query.include('lift2');
        query.include('lift3');
        query.include('lift4');
        query.include('lift5');
        query.include('lift6');
        query.include('lift7');
        query.include('lift8');
        query.include('split');

        try {
            const result = await query.find();
            return result;
        } catch (error) {
            console.error('Error fetching workout:', error);
            throw error;
        }
    },

    updateWorkout: async (objectId, updates = {}) => {
        if (!objectId) throw new Error('ObjectId is required');
        
        const Workouts = Parse.Object.extend('Workouts');
        const query = new Parse.Query(Workouts);
        query.equalTo('objectId', objectId);
        
        try {
            const workout = await query.first();
            if (!workout) throw new Error('Workout not found');
    
            // Handle user update
            if (updates.user) {
                const userPointer = new Parse.User();
                userPointer.id = updates.user.id || updates.user.objectId;
                workout.set('user', userPointer);
            }
    
            // Handle date update
            if (updates.datePerformed) {
                workout.set('datePerformed', new Date(updates.datePerformed));
            }
    
            // Handle lift updates
            for (let i = 1; i <= 8; i++) {
                const lift = updates[`lift${i}`];
                if (lift === null) {
                    // Explicitly set to null - unset the field
                    workout.unset(`lift${i}`);
                } else if (lift) {
                    // New lift provided - update the pointer
                    const liftPointer = new Parse.Object('Lifts');
                    liftPointer.id = lift.id || lift.objectId;
                    workout.set(`lift${i}`, liftPointer);
                }
                // If lift is undefined, don't modify the field
            }
    
            // Handle split update
            if (updates.split === null) {
                workout.unset('split');
            } else if (updates.split) {
                const splitPointer = new Parse.Object('Splits');
                splitPointer.id = updates.split.id || updates.split.objectId;
                workout.set('split', splitPointer);
            }
    
            // Handle day update
            if (updates.day === null) {
                workout.unset('day');
            } else if (updates.day !== undefined) {
                workout.set('day', updates.day);
            }
            if (updates.completed === null) {
                workout.unset('completed');
            } else if (updates.completed !== undefined) {
                workout.set('completed', updates.completed);
            }
            const result = await workout.save();
            return result;
        } catch (error) {
            console.error('Error updating workout:', error);
            throw error;
        }
    },

    deleteWorkout: async (objectId) => {
        const Workouts = Parse.Object.extend('Workouts');
        const query = new Parse.Query(Workouts);
        query.equalTo('objectId', objectId);
        
        try {
            const workout = await query.first();
            if (!workout) throw new Error('Workout not found');
            
            const result = await workout.destroy();
            return result;
        } catch (error) {
            console.error('Error deleting workout:', error);
            throw error;
        }
    },
};

export default workoutsService;