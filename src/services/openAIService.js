import Parse from 'parse';
import liftTypesService from './liftTypesService';

const openAIService = {
    generateWorkout: async (splitDay, bodyParts, userDescription = '', userLevel = 'intermediate') => {
        try {
            // Get all available lift types
            const allLiftTypes = await liftTypesService.getLiftTypes();
            
            // Filter lift types to only include those matching the body parts AND with rating > 6.5
            const availableExercises = allLiftTypes
                .filter(lift => 
                    bodyParts.includes(lift.get('bodyPart')) && 
                    lift.get('rating') > 6.5
                )
                .map(lift => ({
                    name: lift.get('name'),
                    bodyPart: lift.get('bodyPart'),
                    equipment: lift.get('equipment'),
                    type: lift.get('type'),
                    level: lift.get('level'),
                    rating: lift.get('rating')
                }));

            // Group exercises by body part for better organization in the prompt
            const exercisesByBodyPart = {};
            bodyParts.forEach(part => {
                exercisesByBodyPart[part] = availableExercises
                    .filter(ex => ex.bodyPart === part)
                    .sort((a, b) => b.rating - a.rating); // Sort by rating within each body part
            });

            // Create parameters for the cloud function
            const params = {
                bodyParts,
                userDescription,
                userLevel,
                splitDay,
                exercisesByBodyPart
            };

            // Call the Parse Cloud Function that interfaces with OpenAI
            const result = await Parse.Cloud.run('generateWorkout', params);

            return result;
        } catch (error) {
            console.error('Error generating workout:', error);
            throw error;
        }
    },

    mapWorkoutToExercises: async (generatedWorkout) => {
        const exercises = [];
        
        for (const exercise of generatedWorkout) {
            try {
                // Find matching lift type in our database
                const liftType = await liftTypesService.nGetLiftType(exercise.name);
                
                if (liftType && liftType.get('rating') > 6.5) {
                    // Convert weight recommendation to a number if possible
                    let weight = exercise.weight;
                    if (typeof weight === 'string') {
                        const matches = weight.match(/\d+/g);
                        if (matches) {
                            weight = matches.reduce((a, b) => parseInt(a) + parseInt(b), 0) / matches.length;
                        }
                    }

                    exercises.push({
                        liftType: liftType,
                        sets: parseInt(exercise.sets),
                        reps: parseInt(exercise.reps.split('-')[0]),
                        weight: weight,
                        notes: exercise.notes
                    });
                }
            } catch (error) {
                console.error(`Error mapping exercise ${exercise.name}:`, error);
            }
        }

        return exercises;
    }
};

export default openAIService;