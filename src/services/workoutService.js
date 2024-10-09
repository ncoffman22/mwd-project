import { Parse } from "parse";

const workoutService = {
    // This loads everything from the json file and saves it in local storage
  loadWorkoutsFromFile: async (username) => {
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

  // This gets the workouts for a user from local storage
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

  // This gets the workouts for a user from local storage and adds one
  addWorkout: async (username, workout) => {
      const myNewObject = new Parse.Object("Workouts");
      myNewObject.set("user", username);
      myNewObject.set('liftType', workout.liftType);
      myNewObject.set('sets', workout.sets);
      myNewObject.set('reps', workout.reps);
      myNewObject.set('weight', workout.weight);
      myNewObject.set('date', workout.date);
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
};

export default workoutService;
