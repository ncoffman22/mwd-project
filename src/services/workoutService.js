import { Parse } from "parse";

// This works off of the Parse.Workouts class
const workoutService = {
  // READ — This gets the workouts for a user from Parse
  loadWorkouts: async (username) => {
    try {
      const Workouts = Parse.Object.extend("Workouts");
      const query = new Parse.Query(Workouts);
      query.equalTo("user", username);
      const results = await query.find();

      if (results.length > 0) {
        const workouts = results.map((result) => result.toJSON());
        console.log("Loaded workouts from Parse:", workouts);
        return workouts;
      } else {
        console.log("No workouts found for user:", username);
        return [];
      }
    } catch (error) {
      console.error("Failed to load workouts from Parse:", error);
      throw error;
    }
  },


  // Add a new website to the database
  addWorkout: async (username, workout) => {
      const myNewObject = new Parse.Object("Workouts");
      myNewObject.set("user", username);
      myNewObject.set('liftType', workout.name);
      myNewObject.set('sets', workout.sets);
      myNewObject.set('reps', workout.reps);
      myNewObject.set('weight', workout.weight);
      myNewObject.set('datePerformed', workout.datePerformed);
      try {
        const result = await myNewObject.save();
        console.log('Workout added:', result);
        const workouts = await workoutService.loadWorkouts(username)
        return workouts;
      } catch (error) {
      console.error("Failed to add workout:", error);
      throw error;
      }
  },

  // UPDATE — This updates a workout in the Parse database
  updateWorkout: async (username, workout) => {
    const Workouts = Parse.Object.extend("Workouts");
    const query = new Parse.Query(Workouts);
    query.equalTo("objectId", workout.objectId);
    try {
      const result = await query.first();
      result.set('liftType', workout.name);
      result.set('sets', workout.sets);
      result.set('reps', workout.reps);
      result.set('weight', workout.weight);
      result.set('datePerformed', workout.datePerformed);
      await result.save();
      console.log('Workout updated:', result);
      const workouts = await workoutService.loadWorkouts(username)
      return workouts;
    } catch (error) {
      console.error("Failed to update workout:", error);
      throw error;
    }
  },

  // Will delete from the database. This has yet to be implemented, but will eb in the future
  deleteWorkout: async (username, workout) => {
    const Workouts = Parse.Object.extend("Workouts"); // Find the workout for that user, and destroy it
    const query = new Parse.Query(Workouts);
    query.equalTo("objectId", workout.objectId);
    try {
      const result = await query.first();
      await result.destroy();
      console.log('Workout deleted:', result); // Console logs for development will be deleted later on
      const workouts = await workoutService.loadWorkouts(username)
      return workouts;
    } catch (error) {
      console.error("Failed to delete workout:", error);
      throw error;
    }
  },
};

export default workoutService;