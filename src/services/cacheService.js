import workoutsService from "./workoutsService";
import liftTypesService from "./liftTypesService";
import liftsService from "./liftsService";
import splitService from "./splitService";
import Parse from "parse";
import statisticsService from "./statisticsService";
import authService from "./authService";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const localCache = {
    set: (key, value) => {
        try {
            // Convert Parse objects to JSON before storing
            const serialized = JSON.stringify(value, (key, value) => {
                if (value instanceof Parse.Object) {
                    return {
                        __type: 'ParseObject',
                        className: value.className,
                        id: value.id,
                        attributes: value.attributes
                    };
                }
                return value;
            });
            localStorage.setItem(key, serialized);
        } catch (error) {
            console.error('Error setting cache:', error);
        }
    },
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;

            // Reconstruct Parse objects from JSON
            return JSON.parse(item, (key, value) => {
                if (value && value.__type === 'ParseObject') {
                    const obj = new Parse.Object(value.className);
                    obj.id = value.id;
                    Object.assign(obj.attributes, value.attributes);
                    return obj;
                }
                return value;
            });
        } catch (error) {
            console.error('Error getting cache:', error);
            return null;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing cache:', error);
        }
    }
};



export const getCachedUserWorkouts = async (userId) => {
    try {
        const cacheKey = `workouts-${userId}`;
        const cachedWorkouts = localCache.get(cacheKey);
        if (cachedWorkouts && Array.isArray(cachedWorkouts) && 
            cachedWorkouts.every(w => w instanceof Parse.Object)) {
            return cachedWorkouts;
        }

        const user = authService.getCurrentUser();
        const workouts = await workoutsService.uGetWorkout(user);
        localCache.set(cacheKey, workouts);
        return workouts;
    } catch (error) {
        throw error;
    }
};

export const getCachedUserLifts = async (userId) => {
    try {
        const cacheKey = `lifts-${userId}`;
        const cachedLifts = localCache.get(cacheKey);
        if (cachedLifts && Array.isArray(cachedLifts) && 
            cachedLifts.every(l => l instanceof Parse.Object)) {
            return cachedLifts;
        }

        const user = authService.getCurrentUser();
        const lifts = await liftsService.uGetLifts(user);
        localCache.set(cacheKey, lifts);
        return lifts;
    } catch (error) {
        throw error;
    }
};

export const getCachedUserLiftTypes = async (userId) => {
    try {
        const cacheKey = `liftTypes-${userId}`;
        const cachedLiftTypes = localCache.get(cacheKey);
        if (cachedLiftTypes && Array.isArray(cachedLiftTypes) && 
            cachedLiftTypes.every(lt => lt instanceof Parse.Object)) {
            return cachedLiftTypes;
        }
        const liftTypes = await liftTypesService.getLiftTypes();
        localCache.set(cacheKey, liftTypes);
        return liftTypes;
    } catch (error) {
        throw error;
    }
};

export const getCachedSplits = async (userId) => {
    try {
        const cacheKey = `splits-${userId}`;
        const cachedSplits = localCache.get(cacheKey);
        if (cachedSplits && Array.isArray(cachedSplits) && 
            cachedSplits.every(s => s instanceof Parse.Object)) {
            return cachedSplits;
        }

        const user = authService.getCurrentUser();
        const splits = await splitService.getSplit(user);
        localCache.set(cacheKey, splits);
        return splits;
    } catch (error) {
        throw error;
    }
};

export const getCachedUserStatistics = async (userId) => {
    try {
        const cacheKey = `statistics-${userId}`;
        const cachedStats = localCache.get(cacheKey);
        if (cachedStats) return cachedStats;
        const stats = await statisticsService.getUserStatistics(userId);
        localCache.set(cacheKey, stats);
        return stats;
    } catch (error) {
        throw error;
    }
};

export const getProcessedWorkouts = async () => {
    const loadData = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            const userWorkouts = await getCachedUserWorkouts(currentUser.id);
            const userLifts = await getCachedUserLifts(currentUser.id);
            const liftTypes = await getCachedUserLiftTypes(currentUser.id);
            const processedWorkouts = [];
            for (let i = 0; i < userWorkouts.length; i++) {
                const workout = userWorkouts[i];
                const liftPromises = [];
                // Gather all lifts from the workout (lift1 through lift8)
                for (let i = 1; i <= 8; i++) {
                    const liftKey = `lift${i}`;
                    const lift = workout.get(liftKey);
                    if (lift) {
                        try {
                            const liftData = await userLifts.find((l) => l.id === lift.id);
                            liftPromises.push(liftData);
                        } catch (error) {
                            console.error(`Error fetching lift ${i}:`, error);
                        }
                    }
                }

                const lifts = await Promise.all(liftPromises);
                const liftDetails = await Promise.all(
                    lifts.map(async (lift) => {
                        if (!lift) return null;
                        
                        try {
                            const liftType = lift.get('liftType');
                            const liftTypeDetails = await liftTypes.filter((lt) => lt.id === liftType.id);
                            if (!liftTypeDetails) return null;

                            return {
                                id: lift.id,
                                name: liftTypeDetails[0].get('name'),
                                sets: lift.get('sets'),
                                reps: lift.get('reps'),
                                weight: lift.get('weight'),
                                type: liftTypeDetails[0].get('type'),
                                bodyPart: liftTypeDetails[0].get('bodyPart'),
                                completed: lift.get('completed'),
                                passedSets: lift.get('passedSets'),
                                failedSets: lift.get('failedSets'),
                                liftType: liftType
                            };
                        } catch (error) {
                            console.error('Error processing lift details:', error);
                            return null;
                        }
                    })
                );

                const validLifts = liftDetails.filter(Boolean);

                // Get the datePerformed and adjust for timezone
                const datePerformed = workout.get('datePerformed');
                const adjustedDate = dayjs(datePerformed)
                    .add(datePerformed.getTimezoneOffset(), 'minutes')
                    .toDate();

                processedWorkouts.push( {
                    id: workout.id,
                    completed: workout.get('completed'),
                    date: adjustedDate, // Use the timezone-adjusted date
                    split: workout.get('split') ? workout.get('split') : null,
                    bodyParts: workout.get('split') ? workout.get('split').get(`day${workout.get('day')}`) : [],
                    splitName: workout.get('split') ? workout.get('split').get('name') : 'No Split',
                    day: workout.get('day') || 'Unassigned',
                    lifts: validLifts,
                    totalExercises: validLifts.length,
                    originalWorkout: workout
                });
            }
            return processedWorkouts;
        } catch (error) {
            throw error;
        }
    };
    loadData();
};
// Rest of the invalidation functions remain the same
export const invalidateAllCaches = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem(`workouts-${authService.getCurrentUser()?.id}`);
    localStorage.removeItem(`lifts-${authService.getCurrentUser()?.id}`);
    localStorage.removeItem(`liftTypes-${authService.getCurrentUser()?.id}`);
    localStorage.removeItem(`splits-${authService.getCurrentUser()?.id}`);
    localStorage.removeItem(`statistics-${authService.getCurrentUser()?.id}`);
};

export const updateCachesAfterWorkoutCreate = async (userId, workout) => {
    localStorage.removeItem(`workouts-${userId}`);
    localStorage.removeItem(`statistics-${userId}`);
    localStorage.removeItem(`lifts-${userId}`);
    await getCachedUserWorkouts(userId);
    await getCachedUserStatistics(userId);
    await getCachedUserLifts(userId);
};

export const updateCacheAfterSplitCreate = async (userId, split) => {
    localStorage.removeItem(`splits-${userId}`);
    await getCachedSplits(userId);
};


export const initializeStorageCleanup = () => {
    // Handler for when the window is closed
    const handleUnload = () => {
        try {            
            // Clear all local storage
            localStorage.clear();
        } catch (error) {
            console.error('Error cleaning up storage:', error);
        }
    };

    // Add event listener for tab/window close
    window.addEventListener('unload', handleUnload);

    // Return cleanup function
    return () => {
        window.removeEventListener('unload', handleUnload);
    };
};