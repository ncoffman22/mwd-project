import { useEffect, useState } from "react";
import {Modal, Button, Form} from 'react-bootstrap'
import accountService from "../../services/accountService";
import {getCachedSplits} from '../../services/cacheService'
export default function UserDetails (){
    const [showModal, setShowModal] = useState(false); // Modal visibility
    const [formData, setFormData] = useState({
        name: '',
        birthDate: new Date(),
        height: '',
        weight: '',
        birthSex: '',
        defaultSplit:'' //  query frim cache service and get cached splits and return split name
    }); // defaults for each field
    const [splitOptions, setSplitOptions] = useState(null)

    useEffect(()=>{
            const getDefaults = async ()=>{
                const splits = await getCachedSplits()
                const splitNames = splits.map((s) =>s.get("name"))
                setSplitOptions(splitNames)
            }
            getDefaults()
        }, [])
        
     // Handle form input changes
     const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveChanges = () => {
        // Add your logic to save data, e.g., send it to a server
        setShowModal(false); // Close the modal after saving
        accountService.saveProfile(formData)
    };

    // Open the modal when the user clicks on the profile picture
    const handleEditClick = () => {
            setShowModal(true);
    };
    const handleCloseModal = () =>{
        setShowModal(false)
    }

    return(
        <div>
            <Button variant="primary" onClick={handleEditClick}>
                Edit Profile
            </Button>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDate">
                            <Form.Label>Birthday</Form.Label>
                            <Form.Control
                                type="date"
                                name="birthDate"
                                placeholder="Enter your Birthday"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formHeight">
                            <Form.Label>Height (in)</Form.Label>
                            <Form.Control
                                type="number"
                                name="height"
                                placeholder="Enter your height"
                                value={formData.height}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formWeight">
                            <Form.Label>Weight (in lbs)</Form.Label>
                            <Form.Control
                                type="number"
                                name="weight"
                                placeholder="Enter your weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formBirthSex">
                            <Form.Label>Birth Sex</Form.Label>
                            <Form.Control
                                as="select"
                                name="birthSex"
                                value={formData.birthSex}
                                onChange={handleInputChange}
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="defaultSplit">
                            <Form.Label>Select a Default Split</Form.Label>
                            <Form.Control
                            as="select"
                            value={formData.defaultSplit}>
                                {splitOptions && splitOptions.map((s, index)=>(
                                    <option key={index} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
