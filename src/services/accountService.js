import Parse from "parse";

const accountService = {
    handleSaveProfilePicture: async (imageData, setProfilePic, setShowModal) => {
        const user = Parse.User.current();

        if (imageData) {
            const parseFile = new Parse.File('profile.jpg', { base64: imageData });
            user.set('profilePic', parseFile);

            try {
                await user.save();
                console.log("Profile picture saved successfully");

                // Fetch the updated image URL and update the UI
                const updatedImage = user.get('profilePic').url();
                setProfilePic(updatedImage); 
                setShowModal(false); // Close the modal
            } catch (error) {
                console.error('Error saving profile picture:', error);
            }
        } else {
            console.error('No image data to save');
        }
    },

    getProfilePic: async () => {
        const user = Parse.User.current();
        const image = user.get('profilePic');

        return image?.url() || 'https://via.placeholder.com/150'; // Use optional chaining for safety
    },
    saveProfile: async() => {
        // if (!username || !password) {
        //     throw new Error("Username and password are required");
        // }

        // const user = new Parse.User();
        // user.set("username", username.trim());
        // user.set("password", password);
        
        // try {
        //     const userResult = await user.signUp();
        //     console.log(userResult)
        // } catch (error) {
        //     if (error.code === Parse.Error.USERNAME_TAKEN) {
        //         throw new Error("Username is already taken");
        //     }
        //     throw error;
        // }
        const user = Parse.User.current();
        // user.set()
        // user.set()
    }
};

export default accountService
