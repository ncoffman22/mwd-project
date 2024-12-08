import {Parse} from "parse";

const liftTypesService = {
    addLiftType: async (name, desc, type, bodyPart, equipment, level) => {
        const newLiftType = new Parse.Object("LiftTypes");
        newLiftType.set("name", name);
        newLiftType.set("desc", desc);
        newLiftType.set("type", type);
        newLiftType.set("bodyPart", bodyPart);
        newLiftType.set("equipment", equipment);
        newLiftType.set("level", level);
        try {
            const result = await newLiftType.save();
            return result;
        } catch (error) {
            throw error;
        }

    },

    oGetLiftType: async (objectId) => {
        const LiftTypes = Parse.Object.extend("LiftTypes");
        const query = new Parse.Query(LiftTypes);
        query.equalTo("objectId", objectId);
        try {
            const result = await query.find();
            return result;
        } catch (error) {
            throw error;
        }
    },
    nGetLiftType: async (name) => {
        const LiftTypes = Parse.Object.extend("LiftTypes");
        const query = new Parse.Query(LiftTypes);
        query.equalTo("name", name);
        try {
            const result = await query.first();
            return result;
        } catch (error) {
            throw error;
        }
    },
    getLiftTypes: async () => {
        const LiftTypes = Parse.Object.extend("LiftTypes");
        const query = new Parse.Query(LiftTypes);
        query.limit(3000);
        try {
            const results = await query.find();
            return results;
        } catch (error) {
            throw error;
        }
    },
    updateLiftType: async (objectId, name, desc, type, bodyPart, equipment, level) => {
        const LiftTypes = Parse.Object.extend("LiftTypes");
        const query = new Parse.Query(LiftTypes);
        query.equalTo("objectId", objectId);
        try {
            const result = await query.first();
            result.set("name", name);
            result.set("desc", desc);
            result.set("type", type);
            result.set("bodyPart", bodyPart);
            result.set("equipment", equipment);
            result.set("level", level);
            const updateResult = await result.save();
            return updateResult;
        } catch (error) {
            throw error;
        }
    },
    deleteLiftType: async (objectId) => {
        const LiftTypes = Parse.Object.extend("LiftTypes");
        const query = new Parse.Query(LiftTypes);
        query.equalTo("objectId", objectId);
        try {
            const result = await query.first();
            const deleteResult = await result.destroy();
            return deleteResult;
        } catch (error) {
            throw error;
        }
    },

};

export default liftTypesService;
