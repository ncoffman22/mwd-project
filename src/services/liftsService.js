import {Parse} from 'parse';

const liftsService = {
    addLift: async (liftType, reps, sets, weight, user, datePerformed) => {
        const newLift = new Parse.Object("Lifts");
        newLift.set('liftType', liftType);
        newLift.set('reps', reps);
        newLift.set('sets', sets);
        newLift.set('weight', weight);
        newLift.set('user', user);
        newLift.set('datePerformed', datePerformed);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isCompleted = datePerformed <= today;
        newLift.set('completed', isCompleted);
        try {
            const result = await newLift.save();
            return result;
        } catch (error) {
            throw error;
        }
    },
    oGetLift: async (objectId) => {
        const Lifts = Parse.Object.extend("Lifts");
        const query = new Parse.Query(Lifts);
        query.equalTo("objectId", objectId);
        try {
            const result = await query.first();
            return result;
        } catch (error) {
            throw error;
        }
    },
    uGetLifts: async (user) => {
        const Lifts = Parse.Object.extend("Lifts");
        const query = new Parse.Query(Lifts);
        query.equalTo("user", user);
        try {
            const results = await query.find();
            return results;
        } catch (error) {
            throw error;
        }
    },
    tGetLifts: async (liftType) => {
        const Lifts = Parse.Object.extend("Lifts");
        const query = new Parse.Query(Lifts);
        query.equalTo("liftType", liftType);
        try {
            const results = await query.find();
            return results;
        } catch (error) {
            throw error;
        }
    },
    updateLift: async (objectId, options = {}) => {
        const Lifts = Parse.Object.extend("Lifts");
        const query = new Parse.Query(Lifts);
        query.equalTo("objectId", objectId);
        try {
            const result = await query.first();
            if (!result) {
                throw new Error("Lift not found");
            }
    
            // Only set fields that are provided in options
            const {
                liftType,
                reps,
                sets,
                weight,
                user,
                datePerformed,
                completed,
                passedSets,
                failedSets
            } = options;
    
            if (liftType !== undefined) result.set("liftType", liftType);
            if (reps !== undefined) result.set("reps", reps);
            if (sets !== undefined) result.set("sets", sets);
            if (weight !== undefined) result.set("weight", weight);
            if (user !== undefined) result.set("user", user);
            if (datePerformed !== undefined) result.set("datePerformed", datePerformed);
            if (completed !== undefined) result.set("completed", completed);
            if (passedSets !== undefined) result.set("passedSets", passedSets);
            if (failedSets !== undefined) result.set("failedSets", failedSets);
            const saveResult = await result.save();
            return saveResult;
        } catch (error) {
            throw error;
        }
    },
    deleteLift: async (objectId) => {
        const Lifts = Parse.Object.extend("Lifts");
        const query = new Parse.Query(Lifts);
        query.equalTo("objectId", objectId);
        try {
            const result = await query.first();
            result.destroy();
            return result;
        } catch (error) {
            throw error;
        }
    },
};
export default liftsService;