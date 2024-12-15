import Parse from "parse";

const authService = {
    // Gets the current user from Parse
    getCurrentUser:    () => {
        try {
            const currentUser = Parse.User.current();
            return currentUser;
        } catch (error) {
            return null;
        }
    },

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
            console.log(userResult)
        } catch (error) {
            if (error.code === Parse.Error.USERNAME_TAKEN) {
                throw new Error("Username is already taken");
            }
            throw error;
        }
    },

    // Logs out the current user
    logout: async () => {
        localStorage.removeItem("user")
        await Parse.User.logOut();

    },
    update: async (user, goals) => {
        try {
            const currentUser = Parse.User.current();
            currentUser.set("goals", goals);
            await currentUser.save();
        } catch (error) {
            throw error;
        }
    }
    
};

export default authService;
