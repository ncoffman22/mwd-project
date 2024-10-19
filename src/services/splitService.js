import {Parse} from 'parse';


const splitService = {
    // READ — This gets the splits for a user from Parse
    loadSplits: async (username) => {
        try {
            const Splits = Parse.Object.extend("Splits");
            const query = new Parse.Query(Splits);
            query.equalTo("user", username);
            const results = await query.find();

            if (results.length > 0) {
                const splits = results.map((result) => result.toJSON());
                console.log("Loaded splits from Parse:", splits);
                localStorage.setItem(`splits_${username}`, JSON.stringify(splits));
                return splits;
            } else {
                console.log("No splits found for user:", username);
                return [];
            }
        } catch (error) {
            console.error("Failed to load splits from Parse:", error);
            throw error;
        }
    },
    // This gets the splits for a user from local storage / this is done to reduce API requests
    getSplits: (username) => {
        try {
            const splits =
                JSON.parse(localStorage.getItem(`splits_${username}`)) || [];
            return splits;
        } catch (error) {
            console.error("Failed to load splits:", error);
            return [];
        }
    },
    // CREATE — This adds a new split to the Parse database
    addSplit: async (username, split) => {
        const myNewObject = new Parse.Object("Splits");
        const splitDate = new Date(split.date);
        myNewObject.set("user", username);
        myNewObject.set('split_title', split.title);
        myNewObject.set('date', splitDate);

        for (let i = 1; i <= 8; i++) {
            if (split[`workout_${i}`]) {
                const workoutPointer = Parse.Object.extend("Workouts").createWithoutData(split[`workout_${i}`]);
                myNewObject.set(`workout_${i}`, workoutPointer);
            }
        }
        try {
            const result = await myNewObject.save();
            console.log('Split added:', result);

            const splits =
                JSON.parse(localStorage.getItem(`splits_${username}`)) || [];
            splits.push(split);
            localStorage.setItem(`splits_${username}`, JSON.stringify(splits));
            return splits;
        } catch (error) {
            console.error("Failed to add split:", error);
            throw error;
        }
    },
    
    // UPDATE — This updates an existing split in the Parse database
    updateSplit: async (username, split) => {
        const Splits = Parse.Object.extend("Splits");
        const query = new Parse.Query(Splits);
        query.equalTo("objectId", split.objectId);
        const result = await query.first();
        const splitDate = new Date(split.date);
        result.set('split_title', split.title);
        result.set('date', splitDate);

        for (let i = 1; i <= 8; i++) {
            if (split[`workout_${i}`]) {
                const workoutPointer = Parse.Object.extend("Workouts").createWithoutData(split[`workout_${i}`]);
                result.set(`workout_${i}`, workoutPointer);
            }
        }
        try {
            await result.save();
            console.log('Split updated:', result);

            const splits =
                JSON.parse(localStorage.getItem(`splits_${username}`)) || [];
            const index = splits.findIndex((s) => s.objectId === split.objectId);
            splits[index] = split;
            localStorage.setItem(`splits_${username}`, JSON.stringify(splits));
            return splits;
        } catch (error) {
            console.error("Failed to update split:", error);
            throw error;
        }
    },

    // DELETE — This deletes a split from the Parse database
    deleteSplit: async (username, split) => {
        const Splits = Parse.Object.extend("Splits");
        const query = new Parse.Query(Splits);
        query.equalTo("objectId", split.objectId);
        const result = await query.first();
        try {
            await result.destroy();
            console.log('Split deleted:', result);

            const splits =
                JSON.parse(localStorage.getItem(`splits_${username}`)) || [];
            const index = splits.findIndex((s) => s.objectId === split.objectId);
            splits.splice(index, 1);
            localStorage.setItem(`splits_${username}`, JSON.stringify(splits));
            return splits;
        } catch (error) {
            console.error("Failed to delete split:", error);
            throw error;
        }
    },
}
export default splitService;