import Parse from 'parse';
import authService from './authService';
const statisticsService = {
    getUserStatistics: async () => {
        try {
            const user = authService.getCurrentUser();
            const Statistics = Parse.Object.extend("Statistics");
            const query = new Parse.Query(Statistics);
            query.equalTo("user", user);
            query.include("liftType");
            const stats = await query.find(); 
            return stats.map(stat => stat.toJSON());
        } catch (error) {
            console.error("Error fetching user statistics:", error);
            throw new Error("Error fetching user statistics");
        }
    },
    getLiftTypeStatistics: async (userId, liftTypeId) => {
        try {
            const user = authService.getCurrentUser();
            const LiftTypes = Parse.Object.extend("LiftTypes");
            const liftTypeQuery = new Parse.Query(LiftTypes);
            const liftType = await liftTypeQuery.get(liftTypeId);
            const Statistics = Parse.Object.extend("Statistics");
            const query = new Parse.Query(Statistics);
            query.equalTo("user", user);
            query.equalTo("liftType", liftType);
            query.include("liftType");
            const stats = await query.first();
            return stats ? stats.toJSON() : null;
        } catch (error) {
            console.error("Error fetching lift type statistics:", error);
            throw new Error("Error fetching lift type statistics");
        }
    },
    updateStatistics: async (userId) => {
        Parse.Cloud.run("updateLiftStatistics", { userId });
        Parse.Cloud.run("calculateAdvancedStatistics", { userId });
    }
    
};
export default statisticsService;