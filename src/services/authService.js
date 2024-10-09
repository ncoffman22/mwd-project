import axios from "axios";

const authService = {
  // login method
  login: async (username, password) => {
    try {
      // get user from json
      const response = await axios.get("/data/users.json");
      const users = response.data;

      // find user in the json
      const user = users.find(
        (user) => user.username === username && user.password === password
      );

      // if they're there, return it. If not, throw an error.
      if (user) {
        // will probably add to this as we get a database and authentication improves.
        const userData = { username: user.username, password: user.password };
        // sets in local storage (mostly an error check for us)
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      } else {
        throw new Error("Invalid username or password.");
      }
    } catch (error) {
      // error catching
      console.error("Login failed:", error);
      throw error;
    }
  },

  // registration method
  register: async (username, password) => {
    try {
      // creates a newuser instance
      const newUser = { username, password };

      // get the json data again
      const response = await axios.get("/data/users.json");
      const users = response.data;

      // this logic is to check if the user is already in the database
      const user = users.find((user) => newUser.username === user.username);

      if (!user) {
        // if not add it to local storage and return it
        localStorage.setItem("user", JSON.stringify(newUser));
        return newUser;
      } else {
        // if yes, then throw an error
        // Probably need to add a "username is already is taken" but I'll do that later
        throw new Error("Invalid username.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  // returns the current user
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
