import React from "react";
import AddWorkoutParent from "./AddWorkoutParent";
import { Container } from "react-bootstrap";
export default function AddWorkoutContainer () {
    //Wraps the workout component
    return (
        <Container>
            <AddWorkoutParent />
        </Container>
    );
}
