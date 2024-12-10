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
        try{
            const User =  Parse.User.current();
            const query = new Parse.Query(User);
            let user = await query.get(User.id)
            const birthday = new Date(profileData["birthDate"])
            user.set("name", profileData["name"]);
            user.set("birthday", birthday);
            user.set("height", parseInt(profileData["height"]));
            user.set("bodweight", parseInt(profileData["weight"]));
            user.set("sex", profileData["birthSex"]=="male" ? true : false);
            user.set("default", profileData["defaultSplit"])
            const result = await user.save();
            return result
        } catch(error){
            throw error
        }
    }
};

export default accountService
