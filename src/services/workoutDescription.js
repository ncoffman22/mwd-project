import Parse from 'parse';

const workoutDescriptionService = {
    parseGPTResponse: (response) => {
        const descriptionMatch = response.match(/Detailed Description: ([\s\S]*?)(?=- Instructions:|$)/);
        const instructionsMatch = response.match(/Instructions: ([\s\S]*?)$/);
        return {
            description: descriptionMatch ? descriptionMatch[1].trim() : '',
            instructions: instructionsMatch ? instructionsMatch[1].trim() : ''
        };
    },

    generateWorkoutDescription: async (exercise) => {
        try {
            const response = await Parse.Cloud.run("generateWorkoutDescription", {
                title: exercise.get('name'),
                description: exercise.get('desc'),
                equipment: exercise.get('equipment'),
                bodyPart: exercise.get('bodyPart'),
                difficulty: exercise.get('level')
            });
            
            if (!response.success) {
                throw new Error("Failed to generate description");
            }
            return workoutDescriptionService.parseGPTResponse(response.workoutDetails);
        } catch (error) {
            console.error("Error generating workout description:", error);
            throw error;
        }
    },

    updateLiftTypeDetails: async (liftTypeId, description, instructions) => {
        const LiftTypes = Parse.Object.extend("LiftTypes");
        const query = new Parse.Query(LiftTypes);
        try {
            const liftType = await query.get(liftTypeId);
            liftType.set("desc", description);
            liftType.set("instructions", instructions);
            return await liftType.save();
        } catch (error) {
            console.error("Error updating lift type details:", error);
            throw error;
        }
    }
};

export default workoutDescriptionService;