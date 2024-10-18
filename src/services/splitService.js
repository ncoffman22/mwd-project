import {Parse} from 'parse';


const splitService = {
    // This gets the splits for a user from Parse
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
    // This adds a new split to the Parse database
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
    // just need to add crud operations — update, delete, etc.
}
export default splitService;