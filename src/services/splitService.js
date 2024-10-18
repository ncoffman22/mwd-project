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
        myNewObject.set("user", username);
        myNewObject.set('split_title', split.split_title);
        myNewObject.set('date', split.date);
        myNewObject.set('workout_1', split.workout_1);
        myNewObject.set('workout_2', split.workout_2);
        myNewObject.set('workout_3', split.workout_3);
        myNewObject.set('workout_4', split.workout_4);
        myNewObject.set('workout_5', split.workout_5);
        myNewObject.set('workout_6', split.workout_6);
        myNewObject.set('workout_7', split.workout_7);
        myNewObject.set('workout_8', split.workout_8);
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