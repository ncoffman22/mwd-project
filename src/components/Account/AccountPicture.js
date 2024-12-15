import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { Modal, Button } from 'react-bootstrap';

import 'cropperjs/dist/cropper.css'; // Import cropper CSS for styling
import accountService from '../../services/accountService';
const AccountPicture = () => {
    const [imageData, setImageData] = useState(); // Store cropped image data
    const [showModal, setShowModal] = useState(false); // Modal visibility
    const [profilePic, setProfilePic] = useState(); // Profile picture state
    const [isWebcam, setIsWebcam] = useState(true); // Switch between webcam and file upload
    const fileInputRef = useRef(null); // Ref for file input

    // Load the profile picture from database if any when page opens
    useEffect(() => {
        const fetchProfilePic = async () => {
            const picUrl = await accountService.getProfilePic();
            setProfilePic(picUrl);
        };
        fetchProfilePic();
    }, []);

    // Open the modal when the user clicks on the profile picture
    const handleProfilePicClick = () => {
        setShowModal(true);
    };

    // Close the modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Handle image upload (get the base64 image, set the image as that and store to database)
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result;
            setImageData(base64Image);
            await accountService.handleSaveProfilePicture(base64Image, setProfilePic, setShowModal); // Automatically save image
        };
        reader.readAsDataURL(file); // Convert the file to base64
    };

    // Handle webcam capture
    const handleCapture = (imageSrc) => {
        setImageData(imageSrc); // Set captured image as data
    };

    return (
        <div>
            <div onClick={handleProfilePicClick}>
                {/* Show profile picture*/}
                <img
                    src={profilePic}
                    alt="Profile"
                    style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                    }}
                />
            </div>

            {/* Modal for uploading/capturing image*/}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Profile Picture</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isWebcam ? (
                        <>
                            <h5>Take a Picture</h5>
                            <Webcam
                                audio={false}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{ facingMode: 'user' }}
                                style={{ width: '100%' }}
                                ref={fileInputRef}
                            />
                            <Button variant="primary" 
                                onClick={() => handleCapture(fileInputRef.current.getScreenshot())}>
                                Capture Image
                            </Button>
                        </>
                    ) : (
                        <>
                        {/*Upload an Image*/}
                            <h5>Upload</h5>
                            <input type="file" accept="image/*" onChange={handleImageUpload} />
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="secondary" onClick={isWebcam ? () => setIsWebcam(false) : () => setIsWebcam(true)}>
                        Switch to {isWebcam ? 'Upload' : 'Webcam'}
                    </Button>
                    {isWebcam && (
                        <Button variant="primary" onClick={() => accountService.handleSaveProfilePicture(imageData, setProfilePic, setShowModal)}>
                            Save Changes
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AccountPicture;
