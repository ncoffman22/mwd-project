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
    saveProfile: async(profileData) => {
        const user = Parse.User.current();
        user.set("sex", profileData["date"])
        // user.set()
    }
};

export default accountService
