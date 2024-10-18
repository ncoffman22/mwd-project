import Parse from "parse";

// Works off of the Parse.User class
const authService = {
  // Logs in a user with a username and password
  login: async (username, password) => {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    try {
      const user = await Parse.User.logIn(username.trim(), password);
      if (!user) {
        throw new Error("Login succeeded but no user was returned");
      }

      const userData = {
        username: user.get("username"),
        objectId: user.id,
        // if you have other user data you want to store, add it here
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
        throw new Error("Invalid username or password");
      }
      throw error;
    }
  },

  // Registers a new user with a username and password
  register: async (username, password) => {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    const user = new Parse.User();
    user.set("username", username.trim());
    user.set("password", password);
    
    try {
      const userResult = await user.signUp();
      
      const userData = {
        username: userResult.get("username"),
        objectId: userResult.id,
        // if you have other user data you want to store, add it here
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      if (error.code === Parse.Error.USERNAME_TAKEN) {
        throw new Error("Username is already taken");
      }
      throw error;
    }
  },

  // Gets the current user from local storage
  getCurrentUser: () => {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      localStorage.removeItem("user");
      return null;
    }
  },

  // Logs out the current user
  logout: async () => {
    localStorage.removeItem("user");
    await Parse.User.logOut();
  },
  // need to add update methods for user data / might want to consider adding a component for user settings / profile info
};

export default authService;