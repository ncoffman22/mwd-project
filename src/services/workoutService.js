import { Parse } from "parse";

// This works off of the Parse.Workouts class
const workoutService = {
  // This gets the workouts for a user from Parse
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

  // This adds a new workout to the Parse database
  addWorkout: async (username, workout) => {
      const myNewObject = new Parse.Object("Workouts");
      const workoutDate = new Date(workout.date);
      myNewObject.set("user", username);
      myNewObject.set('liftType', workout.name);
      myNewObject.set('sets', workout.sets);
      myNewObject.set('reps', workout.reps);
      myNewObject.set('weight', workout.weight);
      myNewObject.set('date', workoutDate);
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
  // just need to add other crud operations here — update, delete, etc.
};

export default workoutService;
