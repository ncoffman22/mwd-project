import Parse from "parse";

const authService = {
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
        // Add any other user properties you need
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
        // Add any other user properties you need
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
};

export default authService;