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
            // Create the user query in order to upload database
            const User =  Parse.User.current();
            const query = new Parse.Query(User);
            let user = await query.get(User.id)
            const birthday = new Date(profileData["birthDate"])
            // Set the different fields to the input data
            user.set("name", profileData["name"]);
            user.set("birthday", birthday);
            user.set("height", parseInt(profileData["height"]));
            user.set("bodweight", parseInt(profileData["weight"]));
            user.set("sex", profileData["birthSex"]=="male" ? true : false);
            user.set("default", profileData["defaultSplit"])
            // Send the 
            const result = await user.save();
            return result
        } catch(error){
            throw error
        }
    },
    getData: async ()=>{
        const user = Parse.User.current()
        const data = {
            name: user.get("name"),
            birthDate: user.get("birthday"),
            height: user.get("height"),
            weight: user.get("bodweight"),
            birthSex: user.get("sex"),
            defaultSplit: user.get("default"),
        }
        return data
    },
};

export default accountService
