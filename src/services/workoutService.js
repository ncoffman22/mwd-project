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
        localStorage.setItem(`workouts_${username}`, JSON.stringify(workouts));
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

  // This gets the workouts for a user from local storage / this is done to reduce API requests
  getWorkouts: (username) => {
    try {
      // parse the data saved in local storage
      const workouts =
        JSON.parse(localStorage.getItem(`workouts_${username}`)) || [];
      return workouts; // return them
    } catch (error) {
      // just log it in the console, only error would be in JSON or localstorage
      // so we aren't gonna throw a weird error that's not necessary
      console.error("Failed to load workouts:", error);
      return [];
    }
  },

  // CREATE — This adds a new workout to the Parse database
  addWorkout: async (username, workout) => {
      const myNewObject = new Parse.Object("Workouts");
      const workoutDate = new Date(workout.datePerformed);
      myNewObject.set("user", username);
      myNewObject.set('liftType', workout.name);
      myNewObject.set('sets', workout.sets);
      myNewObject.set('reps', workout.reps);
      myNewObject.set('weight', workout.weight);
      myNewObject.set('datePerformed', workoutDate);
      try {
        const result = await myNewObject.save();
        console.log('Workout added:', result);

        const workouts =
        JSON.parse(localStorage.getItem(`workouts_${username}`)) || [];
        workouts.push(workout);
        localStorage.setItem(`workouts_${username}`, JSON.stringify(workouts));
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
      const workoutDate = new Date(workout.datePerformed);
      result.set('liftType', workout.name);
      result.set('sets', workout.sets);
      result.set('reps', workout.reps);
      result.set('weight', workout.weight);
      result.set('datePerformed', workoutDate);
      await result.save();
      console.log('Workout updated:', result);

      const workouts =
        JSON.parse(localStorage.getItem(`workouts_${username}`)) || [];
      const index = workouts.findIndex((w) => w.objectId === workout.objectId);
      workouts[index] = workout;
      localStorage.setItem(`workouts_${username}`, JSON.stringify(workouts));
      return workouts;
    } catch (error) {
      console.error("Failed to update workout:", error);
      throw error;
    }
  },

  // DELETE — This deletes a workout from the Parse database
  deleteWorkout: async (username, workout) => {
    const Workouts = Parse.Object.extend("Workouts");
    const query = new Parse.Query(Workouts);
    query.equalTo("objectId", workout.objectId);
    try {
      const result = await query.first();
      await result.destroy();
      console.log('Workout deleted:', result);

      const workouts =
        JSON.parse(localStorage.getItem(`workouts_${username}`)) || [];
      const index = workouts.findIndex((w) => w.objectId === workout.objectId);
      workouts.splice(index, 1);
      localStorage.setItem(`workouts_${username}`, JSON.stringify(workouts));
      return workouts;
    } catch (error) {
      console.error("Failed to delete workout:", error);
      throw error;
    }
  },
};

export default workoutService;
