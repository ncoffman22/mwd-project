import Parse from "parse";
const authService = {
  // login method
  login: async (username, password) => {
    try {
      // get user from json
      let user = await Parse.User.logIn(username, password);
      console.log('Logged in user:', user);
      localStorage.setItem("user", JSON.stringify(user));
      const userData = { username: user.username, password: user.password };
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  // registration method
  register: async (username, password) => {
      const user = new Parse.User();
      user.set("username", username);
      user.set("password", password);
      try {
        let userResult = await user.signUp();
        console.log('Registered user:', userResult);
        const newUser = { username, password };
        localStorage.setItem("user", JSON.stringify(newUser));
        return newUser;
      } catch (error) {
        console.error("Registration failed:", error);
      }

  },

  // returns the current user
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
