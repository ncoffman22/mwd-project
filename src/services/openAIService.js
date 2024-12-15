import Parse from 'parse';
import { getCachedUserLiftTypes } from './cacheService';
const openAIService = {
    generateWorkout: async (bodyParts, userDescription = '', userLevel = 'intermediate', userId) => {
        try {
            // Create parameters for the cloud function
            const params = {
                bodyParts,
                userDescription,
                userLevel,
                userId
            };

            var result = {};
            var length = 0;
            // resolves the error of the length being 0 or 1
            while (length < 1) {
                result = await Parse.Cloud.run('generateWorkout', params);
                length = result.length;
            }
            const lifts = [];
            const liftTypes = await getCachedUserLiftTypes(userId);
            for (const lift of result) {
                const name = lift.name;
                const liftTypePointer = liftTypes.find(liftType => name === liftType.get('name'));
                if (liftTypePointer) {
                    lifts.push({
                        liftType: liftTypePointer,
                        sets: parseInt(lift.sets),
                        reps: parseInt(lift.reps),
                        weight: parseInt(lift.weight)
                    });
                }

            }
            return lifts;
        } catch (error) {
            console.error('Error generating workout:', error);
            throw error;
        }
    }
};

export default openAIService;