import {Parse} from 'parse';

const splitService = {
    addSplit: async(name, description, days, day1=[], day2=[], day3=[], day4=[], day5=[], day6=[], user=null) => {
        const newSplit = new Parse.Object('WorkoutSplits');
        newSplit.set('name', name);
        newSplit.set('description', description);
        newSplit.set('days', days);
        newSplit.set('day1', day1.length > 0 ? day1 : null);
        newSplit.set('day2', day2.length > 0 ? day2 : null);
        newSplit.set('day3', day3.length > 0 ? day3 : null);
        newSplit.set('day4', day4.length > 0 ? day4 : null);
        newSplit.set('day5', day5.length > 0 ? day5 : null);
        newSplit.set('day6', day6.length > 0 ? day6 : null);
        console.log('user:', user);
        newSplit.set('userSpecific', user);
        try {
            const result = await newSplit.save();
            return result;
        } catch (error) {
            throw error;
        }
    },
    oGetSplit: async (objectId) => {
        const Splits = Parse.Object.extend('WorkoutSplits');
        const query = new Parse.Query(Splits);
        query.equalTo('objectId', objectId);
        try {
            const result = await query.find();
            return result;
        } catch (error) {
            throw error;
        }
    },
    nGetSplit: async (name) => {
        const Splits = Parse.Object.extend('WorkoutSplits');
        const query = new Parse.Query(Splits);
        query.equalTo('name', name);
        try {
            const result = await query.find();
            return result;
        } catch (error) {
            throw error;
        }
    },
    getSplit: async () => {
        const Splits = Parse.Object.extend('WorkoutSplits');
        try {
            const currentUser = Parse.User.current();
            const userSpecificQuery = new Parse.Query(Splits);
            userSpecificQuery.equalTo('userSpecific', currentUser);
            const generalQuery = new Parse.Query(Splits);
            generalQuery.doesNotExist('userSpecific');
            const mainQuery = Parse.Query.or(userSpecificQuery, generalQuery);
            const results = await mainQuery.find();
            return results;
        } catch (error) {
            throw error;
        }
    },
    updateSplit: async (objectId, name, description, days, day1, day2, day3, day4, day5, day6) => {
        const Splits = Parse.Object.extend('WorkoutSplits');
        const query = new Parse.Query(Splits);
        query.equalTo('objectId', objectId);
        try {
            const result = await query.first();
            result.set('name', name);
            result.set('description', description);
            result.set('days', days);
            result.set('day1', day1);
            result.set('day2', day2);
            result.set('day3', day3);
            result.set('day4', day4);
            result.set('day5', day5);
            result.set('day6', day6);
            try {
                const updateResult = await result.save();
                return updateResult;
            } catch (error) {
                throw error;
            }
        } catch (error) {
            throw error;
        }
    },
    deleteSplit: async (objectId) => {
        const Splits = Parse.Object.extend('WorkoutSplits');
        const query = new Parse.Query(Splits);
        query.equalTo('objectId', objectId);
        try {
            const result = await query.first();
            const deleteResult = await result.destroy();
            return deleteResult;
        } catch (error) {
            throw error;
        }
    },
};

export default splitService;