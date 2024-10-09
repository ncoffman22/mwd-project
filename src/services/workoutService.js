import axios from "axios";

const workoutService = {
  // This loads everything from the json file and saves it in local storage
  loadWorkoutsFromFile: async (username) => {
    try {
      // pull the json data
      const response = await axios.get("/data/usersWorkouts.json");
      const userWorkouts = response.data[username];

      // if there are no workouts, throw this error—may need to not do this, but it's good for bug checking rn
      if (!userWorkouts) {
        throw new Error(`No workouts for this user ${username}`);
      }
      // set everything into localstorage for using in the getworkouts method.
      // This was my solution to ensure we could list workouts that a user adds combined with the workouts pulled
      // from the json data
      localStorage.setItem(
        `workouts_${username}`,
        JSON.stringify(userWorkouts)
      );
      return userWorkouts; // Return the loaded workouts
    } catch (error) {
      console.error("Failed to load workouts:", error);
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
    try {
      // pull workouts in local storage
      const workouts =
        JSON.parse(localStorage.getItem(`workouts_${username}`)) || [];

      // push the new workout onto it
      workouts.push(workout);
      localStorage.setItem(`workouts_${username}`, JSON.stringify(workouts));
      return workouts;
    } catch (error) {
      // same thing as above
      console.error("Failed to add workout:", error);
      throw error;
    }
  },
};

export default workoutService;
